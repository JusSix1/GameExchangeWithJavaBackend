package unit_test

import (
	"testing"

	"github.com/JusSix1/GameExchange/entity"
	"github.com/asaskevich/govalidator"
	"github.com/onsi/gomega"
)

func TestAdminValidate(t *testing.T) {
	g := gomega.NewGomegaWithT(t)

	admin := entity.Admin{ // set up data for test
		Account_Name: "Name1",
		Password:     "12345678",
		Admin_Name:   "bim",
	}

	t.Run("the data is correct", func(t *testing.T) {
		uTest := admin

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).To(gomega.BeTrue()) // ข้อมูลถูก ok จะเป็น true

		g.Expect(err).To(gomega.BeNil()) // ข้อมูลถูก error จะเป็น nil

		//g.Expect(err.Error()).To(gomega.Equal("")) // comment ทิ้งเนื่องจากไม่มี error ก็ย่อมไม่มี error message
	})

	t.Run("Account name can not be blank", func(t *testing.T) {
		uTest := admin
		uTest.Account_Name = ""

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Account name is blank")) // check error message
	})

	t.Run("Password can not be blank", func(t *testing.T) {
		uTest := admin
		uTest.Password = ""

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Password is blank")) // check error message
	})

	t.Run("Password too short", func(t *testing.T) {
		uTest := admin
		uTest.Password = "123"

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Password must be longer than 8 characters")) // check error message
	})

	t.Run("Admin name can not be blank", func(t *testing.T) {
		uTest := admin
		uTest.Admin_Name = ""

		ok, err := govalidator.ValidateStruct(uTest)

		g.Expect(ok).NotTo(gomega.BeTrue()) // ข้อมูลผิด ok จะเป็น false

		g.Expect(err).NotTo(gomega.BeNil()) // ข้อมูลผิด error จะไม่เป็น nil

		g.Expect(err.Error()).To(gomega.Equal("Admin name is blank")) // check error message
	})
}
