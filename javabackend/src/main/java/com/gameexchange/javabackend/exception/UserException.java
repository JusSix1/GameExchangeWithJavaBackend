package com.gameexchange.javabackend.exception;

public class UserException extends BaseException{

    public UserException(String code) {
        super("user." + code);
    }

    //Create
    public static UserException createEmailNull(){return new UserException("create.email.null");}

    public static UserException createPasswordNull(){return new UserException("create.password.null");}

    public static UserException createFirstNameNull(){return new UserException("create.firstname.null");}

    public static UserException createLastNameNull(){return new UserException("create.lastname.null");}

    public static UserException createPersonalIdNull(){return new UserException("create.personal_id.null");}

    public static UserException createProfileNameNull(){return new UserException("create.profile_name.null");}

    public static UserException createDateOfBirthNull(){return new UserException("create.date_of_birth.null");}

    public static UserException createPhoneNumberNull(){return new UserException("create.phone_number.null");}

    public static UserException createAddressNull(){return new UserException("create.address.null");}

    public static UserException createBankAccountNumberNull(){return new UserException("create.bank_account_number.null");}

}
