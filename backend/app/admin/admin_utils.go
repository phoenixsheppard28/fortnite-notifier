package admin

import (
	"net/http"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/phoenixsheppard28/fortnite-notifier/tree/main/backend/app/models"
	"github.com/phoenixsheppard28/fortnite-notifier/tree/main/backend/app/static"
)

func sendFortniteApiRequest(api_path string, cfg *models.Config) (*http.Response, error) {
	req, err := http.NewRequest("GET", cfg.FN_API_ENDPOINT+api_path, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Add("Authorization", cfg.FN_API_KEY)
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}

	return resp, nil
}

func alertUsers(user_item_name_map *map[int64][]string, bot *tgbotapi.BotAPI) error {
	for id, item_name_array := range *user_item_name_map {
		text := static.GetStaticResponse("alert")
		for _, item_name := range item_name_array {
			text = text + item_name + "\n"
		}

		msg := tgbotapi.NewMessage(id, text)
		_, err := bot.Send(msg)
		if err != nil {
			return err
		}
	}
	return nil
}
