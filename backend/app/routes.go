package main

import (
	"errors"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/phoenixsheppard28/fortnite-notifier/tree/main/backend/app/static"
	"gorm.io/gorm"
)

func SayHello(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "Hello world!",
	})
}

func Webhook(c *gin.Context) {
	botAny, exists := c.Get("bot")
	if !exists {
		log.Println("Could not retrieve telegram bot")
		return
	}
	bot := botAny.(*tgbotapi.BotAPI)
	dbAny, exists := c.Get("db")
	if !exists {
		log.Println("Could not retrieve db")
		return
	}
	db := dbAny.(*gorm.DB)

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

func create(update *tgbotapi.Update, db *gorm.DB) (bool, error) {
	// returns true if created new user
	user_id := update.Message.From.ID
	var user = User{ID: user_id}

	user_exists, err := user_exists(user_id, db)
	if err != nil {
		return false, err
	}
	if user_exists {
		return false, nil
	} else {
		result := db.Create(&user)
		if result.Error != nil {
			return false, result.Error
		}
		return true, nil
	}
}

// func start(update *tgbotapi.Update, db *gorm.DB) (string, error) {
// 	user_id := update.Message.From.ID
// 	var user = User{ID: user_id}
// 	user_exists, err := user_exists(user_id, db)
// 	if err != nil {
// 		return "", err
// 	}
// 	if user_exists {

// 	}

// }

func user_exists(user_id int64, db *gorm.DB) (bool, error) {
	var user = User{ID: user_id}
	result := db.First(&user)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return false, nil
		} else {
			return false, result.Error
		}
	}
	return true, nil
}
