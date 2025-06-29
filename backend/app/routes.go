package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"slices"

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
	dbAny, exists := c.Get("db")
	if !exists {
		log.Println("Could not retrieve db")
		return
	}
	cfgAny, exists := c.Get("cfg")
	if !exists {
		log.Printf("Could not retrieve config")
		return
	}
	db := dbAny.(*gorm.DB)
	bot := botAny.(*tgbotapi.BotAPI)
	cfg := cfgAny.(*Config)

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
		uuid, err := start(&update, db)
		if err != nil {
			msg_string = static.GetStaticResponse("error_looking_user")
			break
		}
		if uuid == "" {
			msg_string = static.GetStaticResponse("user_doesent_exist")
		} else {
			msg_string = static.GetStaticResponse("/start_link") + cfg.PUBLIC_URL + "/" + uuid
		}
	case "rotate":
		rotate_successful, err := rotate(&update, db)
		if err != nil {
			msg_string = static.GetStaticResponse("error_looking_user")
			break
		}
		if !rotate_successful {
			msg_string = static.GetStaticResponse("user_doesent_exist")
		} else {
			msg_string = static.GetStaticResponse("/rotate_link")
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

func RebuildItemDatabase(c *gin.Context) {
	dbAny, exists := c.Get("db")
	if !exists {
		log.Println("Could not retrieve db")
		return
	}
	db := dbAny.(*gorm.DB)
	cfgAny, exists := c.Get("cfg")
	if !exists {
		log.Println("Could not retireve config")
		return
	}
	cfg := cfgAny.(*Config)

	req, err := http.NewRequest("GET", cfg.FN_API_ENDPOINT, nil)
	if err != nil {
		c.JSON(500, gin.H{
			"message": "Error creating request",
		})
		return
	}
	req.Header.Add("Authorization", cfg.FN_API_KEY)
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(500, gin.H{
			"message": "Error sending request to fortnite API",
		})
		return
	}
	if resp.StatusCode != 200 {
		c.JSON(500, gin.H{
			"message": "Error getting itms from fortnite API",
		})
	}

	defer resp.Body.Close() // runs at the end of this function
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(500, gin.H{
			"message": "Error: Could not read body of api response",
		})
		return
	}

	var apiResponse FortniteAPIResponse

	err = json.Unmarshal(body, &apiResponse)
	if err != nil {
		c.JSON(500, gin.H{
			"message": "Incoming fortnite API response could not bind to set struct",
		})
		return
	}

	for _, item := range apiResponse.Items {
		if slices.Contains(item.GameplayTags, "Cosmetics.Source.ItemShop") {
			// need to create schema then add it to that with transaction
		}
	}
}
