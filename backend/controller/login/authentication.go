package controller

import (
	"net/http"

	"github.com/JusSix1/GameExchange/entity"
	"github.com/JusSix1/GameExchange/service"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

// LoginPayload login body
type LoginPayloadUser struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// LoginResponse token response
type LoginResponseUser struct {
	Token    string `json:"token"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Position string `json:"position"`
}

// POST /login/user
func LoginUser(c *gin.Context) {
	var payload LoginPayloadUser
	var user entity.User

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//** 3: ค้นหาด้วย Email */ // ตรวจสอบว่ามี Email ที่กรอกมาหรือไม่
	if err := entity.DB().Raw("SELECT * FROM users WHERE email = ? AND deleted_at IS NULL", payload.Email).Scan(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error() + "email is incorrect"})
		return
	}

	// ตรวจสอบรหัสผ่าน
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(payload.Password))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "password is incorrect"})
		return
	}

	// กำหนดค่า SecretKey, Issuer และระยะเวลาหมดอายุของ Token สามารถกำหนดเองได้
	// SecretKey ใช้สำหรับการ sign ข้อความเพื่อบอกว่าข้อความมาจากตัวเราแน่นอน
	// Issuer เป็น unique id ที่เอาไว้ระบุตัว client
	// ExpirationHours เป็นเวลาหมดอายุของ token

	jwtWrapper := service.JwtWrapperUser{
		SecretKey:       "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
		Issuer:          "AuthService",
		ExpirationHours: 168,
	}

	signedToken, err := jwtWrapper.GenerateTokenUser(user.Email)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "error signing token"})
		return
	}

	tokenResponse := LoginResponseUser{
		Token: signedToken,
		Email: user.Email,
	}

	c.JSON(http.StatusOK, gin.H{"data": tokenResponse})
}

// LoginPayload login body
type LoginPayloadAdmin struct {
	Account_Name string `json:"account_name"`
	Password     string `json:"password"`
}

// LoginResponse token response
type LoginResponseAdmin struct {
	Token        string `json:"token"`
	Account_Name string `json:"account_name"`
}

// POST /login/admin
func LoginAdmin(c *gin.Context) {
	var payload LoginPayloadAdmin
	var admin entity.Admin

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//** 3: ค้นหาด้วย Account_Name */ // ตรวจสอบว่ามี Account_Name ที่กรอกมาหรือไม่
	if err := entity.DB().Raw("SELECT * FROM admins WHERE account_name = ? AND deleted_at IS NULL", payload.Account_Name).Scan(&admin).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error() + "Account name is incorrect"})
		return
	}

	// ตรวจสอบรหัสผ่าน
	err := bcrypt.CompareHashAndPassword([]byte(admin.Password), []byte(payload.Password))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "password is incorrect"})
		return
	}

	// กำหนดค่า SecretKey, Issuer และระยะเวลาหมดอายุของ Token สามารถกำหนดเองได้
	// SecretKey ใช้สำหรับการ sign ข้อความเพื่อบอกว่าข้อความมาจากตัวเราแน่นอน
	// Issuer เป็น unique id ที่เอาไว้ระบุตัว client
	// ExpirationHours เป็นเวลาหมดอายุของ token

	jwtWrapper := service.JwtWrapperAdmin{
		SecretKey:       "KscaBcskaCLBjbsugcailaCHscbjkLGOUYGbcsbcligcachVKJAshCaCVakcVGyatcCAVKVACVUIVEIAUWEC7IQQIWQIWGUVCUYfc",
		Issuer:          "AuthService",
		ExpirationHours: 3,
	}

	signedToken, err := jwtWrapper.GenerateTokenAdmin(admin.Account_Name)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "error signing token"})
		return
	}

	tokenResponse := LoginResponseAdmin{
		Token:        signedToken,
		Account_Name: admin.Account_Name,
	}

	c.JSON(http.StatusOK, gin.H{"data": tokenResponse})
}
