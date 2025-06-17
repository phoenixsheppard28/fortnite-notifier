package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Could not load env variables")
	}
	router := gin.Default()
	router.Run(os.Getenv("PORT"))

}
