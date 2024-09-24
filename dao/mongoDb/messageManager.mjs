const mongoose = require('mongoose');
const Message = require('../models/messageModel');

class MessageManager {
  async getAllMessages() {
    try {
      return await Message.find({});
    } catch (error) {
      console.error('Error getting all messages:', error);
      throw error;
    }
  }

  async getMessageById(id) {
    try {
      return await Message.findById(id);
    } catch (error) {
      console.error(`Error getting message by id ${id}:`, error);
      throw error;
    }
  }

  async addMessage(messageData) {
    try {
      const newMessage = new Message(messageData);
      await newMessage.save();
      return newMessage;
    } catch (error) {
      console.error('Error adding new message:', error);
      throw error;
    }
  }

  async updateMessage(id, messageData) {
    try {
      const updatedMessage = await Message.findByIdAndUpdate(id, messageData, { new: true });
      return updatedMessage;
    } catch (error) {
      console.error(`Error updating message with id ${id}:`, error);
      throw error;
    }
  }

  async deleteMessage(id) {
    try {
      await Message.findByIdAndDelete(id);
      return true;
    } catch (error) {
      console.error(`Error deleting message with id ${id}:`, error);
      throw error;
    }
  }
}

module.exports = MessageManager;