package main

import (
	account_controller "github.com/JusSix1/GameExchange/controller/account"
	comment_controller "github.com/JusSix1/GameExchange/controller/comment"
	game_controller "github.com/JusSix1/GameExchange/controller/game"
	login_controller "github.com/JusSix1/GameExchange/controller/login"
	order_controller "github.com/JusSix1/GameExchange/controller/order"
	post_controller "github.com/JusSix1/GameExchange/controller/post"
	revenue_controller "github.com/JusSix1/GameExchange/controller/revenue"
	user_controller "github.com/JusSix1/GameExchange/controller/user"
	"github.com/JusSix1/GameExchange/entity"
	"github.com/JusSix1/GameExchange/middlewares"

	"github.com/gin-gonic/gin"
)

func main() {

	entity.SetupDatabase()

	r := gin.Default()
	r.Use(CORSMiddleware())

	// login User Route
	r.POST("/login/user", login_controller.LoginUser)
	r.POST("/users", user_controller.CreateUser)
	r.GET("/genders", user_controller.ListGenders)

	routerUser := r.Group("/")
	{
		protected := routerUser.Use(middlewares.AuthorizesUser())
		{
			protected.GET("/myinfo/:email", user_controller.GetMyInfo)
			protected.GET("/user/:profilename", user_controller.GetUser)
			protected.GET("/usersprofilepicture/:email", user_controller.GetUserProfilePicture)
			protected.GET("/usernamelist", user_controller.GetUserNameList)
			protected.PATCH("/users", user_controller.UpdateUser)
			protected.PATCH("/usersPassword", user_controller.UpdateUserPassword)
			protected.DELETE("/users/:email", user_controller.DeleteUser)

			protected.POST("/account/:email", account_controller.CreateAccount)
			protected.GET("/all-account/:email", account_controller.GetAllAccount)
			protected.PATCH("/account", account_controller.UpdateAccount)
			protected.DELETE("/account", account_controller.DeleteAccount)

			protected.POST("/game", game_controller.CreateGame)
			protected.GET("/games", game_controller.ListGame)
			protected.GET("/newgame", game_controller.NewGame)

			protected.POST("/post/:email", post_controller.CreatePost)
			protected.GET("/posts", post_controller.ListPost)
			protected.GET("/post/:email/:id", post_controller.GetPost)
			protected.PATCH("/post", post_controller.UpdatePost)

			protected.POST("/order/:email", order_controller.CreateOrder)
			protected.GET("/myorder/:email", order_controller.GetOrder)
			protected.GET("/myreserve/:email", order_controller.GetReserve)
			protected.GET("/mybought/:email", order_controller.GetBought)
			protected.PATCH("/orderslip", order_controller.UpdateOrderSlip)
			protected.PATCH("/orderslipconfirm", order_controller.UpdateOrderSlipConfirm)
			protected.PATCH("/orderreive", order_controller.UpdateOrderReceive)
			protected.DELETE("/order", order_controller.DeleteOrder)
			protected.DELETE("/cancelorder", order_controller.CancelOrder)

			protected.POST("/revenue/:email", revenue_controller.CreateRevenue)
			protected.GET("/revenue/:email", revenue_controller.GetRevenue)
			protected.PATCH("/revenue", revenue_controller.UpdateRevenue)

			protected.POST("/comment/:email", comment_controller.CreateComment)
			protected.GET("/comment/:profile_name", comment_controller.GetComment)
			protected.GET("/mycomment/:email", comment_controller.GetMyComment)
		}
	}

	// Run the server
	r.Run()

}

func CORSMiddleware() gin.HandlerFunc {

	return func(c *gin.Context) {

		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")

		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")

		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {

			c.AbortWithStatus(204)

			return

		}

		c.Next()

	}

}
