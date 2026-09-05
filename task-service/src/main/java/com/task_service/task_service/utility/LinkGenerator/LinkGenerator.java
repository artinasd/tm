package com.task_service.task_service.utility.LinkGenerator;

import com.task_service.task_service.dto.LinkDTO;
import com.task_service.task_service.entity.Link;

import java.net.MalformedURLException;
import java.security.NoSuchAlgorithmException;

public interface LinkGenerator{

    Link createLink(LinkDTO linkRequest) throws MalformedURLException, NoSuchAlgorithmException;

}
