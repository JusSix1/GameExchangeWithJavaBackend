package unit_test

import (
	"testing"

	"github.com/JusSix1/GameExchange/entity"
	"github.com/asaskevich/govalidator"
	"github.com/onsi/gomega"
)

func TestAccountValidate(t *testing.T) {
	g := gomega.NewGomegaWithT(t)

	account := entity.Account{ // set up data for test
		Game_Account:  "Account1",
		Game_Password: "AccountPassword1",
		Price:         100,
	}

	t.Run("the data is correct", func(t *testing.T) {
		uTest := account

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).To(gomega.BeTrue()) // ข้อมูลถูก ok จะเป็น true

		g.Expect(err).To(gomega.BeNil()) // ข้อมูลถูก error จะเป็น nil

		//g.Expect(err.Error()).To(gomega.Equal("")) // comment ทิ้งเนื่องจากไม่มี error ก็ย่อมไม่มี error message
	})

	t.Run("Game account not be blank", func(t *testing.T) {
		uTest := account
		uTest.Game_Account = ""

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Game account is blank")) // check error message
	})

	t.Run("Game password not be blank", func(t *testing.T) {
		uTest := account
		uTest.Game_Password = ""

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Game password is blank")) // check error message
	})

	t.Run("Price not be blank", func(t *testing.T) {

		accountPriceBlank := entity.Account{ // set up data for test
			Game_Account:  "Account2",
			Game_Password: "AccountPassword2",
		}

		uTest := accountPriceBlank

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Price is blank")) // check error message
	})
}
