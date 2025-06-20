package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)

func SayHello(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "Hello world!",
	})
}
func Webhook(c *gin.Context) {
	botAny, exists := c.Get("bot")
	if !exists {
		log.Fatal("Could not retrieve telegram bot")
	}
	bot := botAny.(*tgbotapi.BotAPI)

	var update tgbotapi.Update

	if err := c.ShouldBindJSON(&update); err != nil {
		log.Printf("Could not bind webhook request to JSON: %v", err)
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	if !(update.Message != nil && update.Message.IsCommand() && update.Message.Text != "") {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "Error: did not send a command or message is empty",
		})
		return
	}
	var msg_string string
	switch update.Message.Command() {
	case "help":
		msg_string = "response to help"

	default:
		msg_string = ""
	}
	msg := tgbotapi.NewMessage(update.Message.Chat.ID, msg_string)
	bot.Send(msg)

	c.JSON(200, gin.H{
		"message": "Hello webhook!",
	})
}
