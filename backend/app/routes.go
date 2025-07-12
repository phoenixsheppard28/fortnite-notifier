package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/phoenixsheppard28/fortnite-notifier/tree/main/backend/app/models"
	"github.com/phoenixsheppard28/fortnite-notifier/tree/main/backend/app/static"
	"gorm.io/gorm"
)

func SayHello(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "Hello world!",
	})
}

func Webhook(c *gin.Context) {
	bot := c.MustGet("bot").(*tgbotapi.BotAPI)
	db := c.MustGet("db").(*gorm.DB)
	cfg := c.MustGet("cfg").(*models.Config)

	var update tgbotapi.Update

	if err := c.ShouldBindJSON(&update); err != nil {
		log.Printf("Could not bind webhook request to JSON: %v", err)
		c.AbortWithStatus(http.StatusOK)
		return
	}

	if update.Message == nil || update.Message.Chat == nil || update.Message.Text == "" {
		c.AbortWithStatusJSON(http.StatusOK, gin.H{
			"message": "Error: did not send a command or some part of message is empty",
		})
		return
	}
	if !update.Message.IsCommand() {
		bot.Send(tgbotapi.NewMessage(update.Message.Chat.ID, static.GetStaticResponse("no_command")))
		return
	}

	var msg_string string
	switch update.Message.Command() {
	case "help":
		msg_string = static.GetStaticResponse("help")

	case "create":
		user_created, err := create(&update, db)
		if err != nil {
			msg_string = static.GetStaticResponse("error_creating_user")
			break
		}
		if user_created {
			msg_string = static.GetStaticResponse("success_creating_user")
		} else {
			msg_string = static.GetStaticResponse("user_already_exists")
		}
	case "start":
		exists, err := User_exists(update.Message.From.ID, db)
		if err != nil {
			msg_string = static.GetStaticResponse("error_looking_user")
			break
		}
		if !exists {
			msg_string = static.GetStaticResponse("user_doesent_exist")
		} else {
			msg_string = static.GetStaticResponse("/start_link") + cfg.FRONTEND_URL + "/"
		}
	default:
		msg_string = static.GetStaticResponse("default")
	}
	msg := tgbotapi.NewMessage(update.Message.Chat.ID, msg_string)
	if _, err := bot.Send(msg); err != nil {
		log.Printf("Error: failed to send message,%v", err)
	}

	c.JSON(200, gin.H{
		"message": "Hello webhook!",
	})
}
