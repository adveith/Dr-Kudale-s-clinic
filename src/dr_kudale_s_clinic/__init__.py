import logging
import os
import random
from dataclasses import dataclass

from telegram import Update
from telegram.ext import (
    ApplicationBuilder,
    CommandHandler,
    ContextTypes,
    MessageHandler,
)

from .db import db

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)

DATABASE = os.environ["DATABASE"]


appointments_id = None


@dataclass
class AppointmentRequest:
    chat_id: int
    username: str


appointment_requests: dict[int, AppointmentRequest] = {}


async def cmd_appointments(update: Update, context: ContextTypes.DEFAULT_TYPE):
    global appointments_id
    assert update.effective_chat
    await context.bot.send_message(
        chat_id=update.effective_chat.id,
        text="I will send you requests for appointments here.",
    )
    appointments_id = update.effective_chat.id


async def cmd_confirm(update: Update, context: ContextTypes.DEFAULT_TYPE):
    assert update.effective_chat
    assert update.effective_message
    assert update.effective_message.text
    logging.warn(update.effective_message.text)
    parts = update.effective_message.text.split()
    if len(parts) != 2:
        await context.bot.send_message(
            chat_id=update.effective_chat.id,
            text="Invalid command, please use `/confirm {id}`.",
        )
        return
    try:
        id = int(parts[1])
    except ValueError:
        await context.bot.send_message(
            chat_id=update.effective_chat.id,
            text="Invalid ID, please use `/confirm {id}`.",
        )
        return
    if id not in appointment_requests:
        await context.bot.send_message(
            chat_id=update.effective_chat.id,
            text="Invalid ID, please use `/confirm {id}`.",
        )
        return
    appointment = appointment_requests.pop(id)
    await context.bot.send_message(
        chat_id=update.effective_chat.id,
        text=f"Confirming appointment for @{appointment.username}.",
    )


async def msg(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not update.effective_chat:
        return
    if not update.effective_message or not update.effective_message.text:
        return
    assert context.chat_data
    state = context.chat_data.get("state")
    if state == "appointment":
        ...
    if "appointment" in update.effective_message.text.lower():
        await context.bot.send_message(
            chat_id=update.effective_chat.id,
            text="Available slots: 10:00 AM, 11:00 AM, 12:00 PM, 2:00 PM, 3:00 PM, 4:00 PM, 5:00 PM",
        )
        if appointments_id is None:
            logging.error("Appointments ID is not set.")
            return
        id = random.randint(1, 100)
        while id in appointment_requests:
            id = random.randint(1, 100)
        assert update.effective_chat.username
        appointment_requests[id] = AppointmentRequest(
            chat_id=update.effective_chat.id,
            username=update.effective_chat.username,
        )
        await context.bot.send_message(
            chat_id=appointments_id,
            text=f"Appointment request from @{update.effective_chat.username}, please confirm with `/confirm {id}`.",
        )


def main():
    application = ApplicationBuilder().token(os.environ["TOKEN"]).build()

    application.add_handler(CommandHandler("appointments", cmd_appointments))
    application.add_handler(CommandHandler("confirm", cmd_confirm))
    application.add_handler(MessageHandler(None, msg))

    application.run_polling()
