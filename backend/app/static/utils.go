package static

import (
	"encoding/json"
	"log"
	"os"
)

var responses map[string]string

func GetStaticResponse(command string) string {
	response, ok := responses[command]
	if !ok {
		log.Print("Error: Command does not exist in responses")
	}
	return response

}

func LoadStaticResponses() {
	file, err := os.ReadFile("static/responses.json")
	if err != nil {
		log.Print("Could not read static responses")
	}
	err = json.Unmarshal(file, &responses)
	if err != nil {
		panic(err)
	}
}
