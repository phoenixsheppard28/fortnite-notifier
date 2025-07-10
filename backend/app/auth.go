package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"gorm.io/gorm"
)

func TelegramAuthHandler(c *gin.Context) {
	cfgAny, exists := c.Get("cfg")
	if !exists {
		c.AbortWithStatusJSON(500, gin.H{
			"message": "internal server error",
		})
		return
	}
	cfg := cfgAny.(*Config)
	dbAny, exists := c.Get("db")
	if !exists {
		c.AbortWithStatusJSON(500, gin.H{
			"message": "internal server error",
		})
		return
	}
	db := dbAny.(*gorm.DB)

	params := map[string]string{
		"id":         c.Query("id"),
		"first_name": c.Query("first_name"),
		"last_name":  c.Query("last_name"),
		"username":   c.Query("username"),
		"photo_url":  c.Query("photo_url"),
		"auth_date":  c.Query("auth_date"),
		"hash":       c.Query("hash"),
	}
	alphabetical_param_order := []string{"auth_date", "first_name", "id", "last_name", "photo_url", "username"}

	var dataCheckParts []string
	for _, key := range alphabetical_param_order {
		value := params[key]
		if value != "" {
			dataCheckParts = append(dataCheckParts, fmt.Sprintf("%s=%s", key, value))
		}
	}
	dataCheckString := strings.Join(dataCheckParts, "\n")

	secret_key := sha256.Sum256([]byte(cfg.TELEGRAM_TOKEN))

	mac := hmac.New(sha256.New, secret_key[:])
	mac.Write([]byte(dataCheckString))
	calculated_hash := hex.EncodeToString(mac.Sum(nil))

	if calculated_hash != params["hash"] {
		c.AbortWithStatusJSON(400, gin.H{
			"message":          "unsuccessfal authentication",
			"hash":             params["hash"],
			"calculated _hash": calculated_hash,
		})
		return
	}

	// at this point we know that the request is from the real user,
	// but we must verify if they created an account through the bot first, we want to assume we can send push notis

	intUserId, _ := strconv.ParseInt(params["id"], 10, 64)
	user_exists, err := User_exists(intUserId, db)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{
			"message": "internal server error",
		})
		return
	}
	if !user_exists {
		c.Redirect(303, cfg.FRONTEND_URL+"/users/not-created")
	}
	// now we know user exists, we can issue a jwt and return them to the main page with it
	jwt, err := createJWT(params["first_name"], intUserId, cfg)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{
			"message": "internal server error, could not create JWT",
		})
		return
	}
	c.Redirect(303, cfg.FRONTEND_URL+"?token="+jwt)
}

func createJWT(username string, id int64, cfg *Config) (string, error) {
	jwt_secret := []byte(cfg.JWT_SECRET)
	claims := JWTClaims{
		Username: username,
		Id:       id,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 24)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenstring, err := token.SignedString(jwt_secret)
	if err != nil {
		return "", err
	}
	return tokenstring, nil
}

func VerifyJWT(c *gin.Context) {
	// if it made it to this point, the JWTAuthMiddleWare has already verified the token so were good
	c.JSON(200, gin.H{
		"valid": true,
	})
}
