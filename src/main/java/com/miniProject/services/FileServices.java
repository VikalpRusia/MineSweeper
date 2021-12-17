package com.miniProject.services;

import org.springframework.web.multipart.MultipartFile;

public interface FileServices {
    String[] UPLOAD_DIRECTORY = {"resources", "img", "user-img"};

    abstract public boolean saveFile(MultipartFile file, String contextPath, String userName);

    abstract public byte[] loadFile(String contextPath, String userName);
}
