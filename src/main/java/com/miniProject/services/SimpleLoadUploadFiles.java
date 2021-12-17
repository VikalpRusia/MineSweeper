package com.miniProject.services;

import org.springframework.stereotype.Repository;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.Arrays;

@Repository
public class SimpleLoadUploadFiles implements LoadUploadFiles {

    @Override
    public boolean saveFile(MultipartFile file, String contextPath, String userName) {
        StringBuilder sb = new StringBuilder(contextPath)
                .append(File.separator);
        Arrays.stream(UPLOAD_DIRECTORY).forEach(s -> sb.append(s).append(File.separator));
        sb.append(userName);
        File newFile = new File(sb.toString());
        try {
            if (newFile.exists() || createNewFile(newFile)) {
                file.transferTo(newFile);
            }
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }

        return true;
    }

    @Override
    public byte[] loadFile(String contextPath, String userName) {
        StringBuilder sb = new StringBuilder(contextPath)
                .append(File.separator);
        Arrays.stream(UPLOAD_DIRECTORY).forEach(s -> sb.append(s).append(File.separator));
        try (BufferedInputStream img =
                     new BufferedInputStream(new FileInputStream(sb.toString() + userName))) {
            return img.readAllBytes();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
            sb.append("..")
                    .append(File.separator)
                    .append("default-img");
            try (BufferedInputStream img =
                         new BufferedInputStream(new FileInputStream(sb.toString()))) {
                return img.readAllBytes();
            } catch (IOException seriousError) {
                seriousError.printStackTrace();
                return null;
            }
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    private boolean createNewFile(File file) throws IOException {
        if (file.exists()) {
            return true;
        }
        return file.getParentFile().mkdirs() && file.createNewFile();
    }
}
