package com.gameexchange.javabackend.exception;


public class GenderException extends BaseException{
    public GenderException(String code) {
        super("gender." + code);
    }

    public static GenderException notFound(){return new GenderException("not.found");}

}
