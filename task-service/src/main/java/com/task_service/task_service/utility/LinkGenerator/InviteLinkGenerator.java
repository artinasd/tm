package com.task_service.task_service.utility.LinkGenerator;

import com.task_service.task_service.dto.LinkDTO;
import com.task_service.task_service.entity.Link;
import com.task_service.task_service.utility.PasswordHasher.Hash;
import com.task_service.task_service.utility.PasswordHasher.SHA256;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.MalformedURLException;
import java.net.URL;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;

public class InviteLinkGenerator implements LinkGenerator{

    /**
     * public invite link : it will be set only to public chat rooms: hash(chat room created time + chat room id + chat room creatorCode)
     * Expiring invite Link : it is a link that expires after a specific time or after a specific amount of usage: hash(link creation time + chat room id + creatorCode)
     * Directed invite link : this type of links has a target account that allows just targeted account to join: hash(link creation time + chat room id + creatorCode) + hash(target accountCode)
     * @param linkRequest
     * @return
     */
    @Override
    public Link createLink(LinkDTO linkRequest) throws MalformedURLException, NoSuchAlgorithmException {
        Link link = new Link();
        String token = "";
        String tokenBase;

        if (linkRequest.getTargetAccount() != null){
            tokenBase = LocalDateTime.now() + linkRequest.getChatRoom().getId().toString() + linkRequest.getCreator().getAccountCode();
            token = tokenGenerator(tokenBase, linkRequest.getTargetAccount().getAccountCode()); // TODO : its better to use accountCode without any need to target account's entity
        } else if (linkRequest.getLinkType().getType().equals("Expiring")) {
            tokenBase = LocalDateTime.now() + linkRequest.getChatRoom().getId().toString() +linkRequest.getCreator().getAccountCode();
            token = tokenGenerator(tokenBase, null);
        } else {
            tokenBase = linkRequest.getChatRoom().getCreatedAt() + linkRequest.getChatRoom().getId().toString() + linkRequest.getChatRoom().getCreator().getAccountCode();
            token = tokenGenerator(tokenBase, null);
        }

        URL url = UriComponentsBuilder.newInstance()
                .scheme("https")
                .host("TaskManagementSystem.ir")
                .port(80)
                .pathSegment("invite", token)
                .build()
                .toUri()
                .toURL();

        link.setUrl(url);

        return link;
    }

    String tokenGenerator(String tokenBase, String targetCode) throws NoSuchAlgorithmException {
        Hash sha256 = new SHA256();
        return sha256.hash(tokenBase + targetCode);
    }
}
