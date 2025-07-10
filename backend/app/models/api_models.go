package models

import "github.com/golang-jwt/jwt/v5"

type AddItemApiRequest struct {
	Item_IDs []string `json:"item_ids" binding:"required,max=1000,dive,required"`
}

type JWTClaims struct {
	Username string `json:"username,omitempty"`
	Id       int64  `json:"id,omitempty"`
	jwt.RegisteredClaims
}
