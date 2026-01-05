# 📦 Code Backend - Prêt à Copier-Coller

Ce fichier contient le code Java complet à ajouter dans votre backend Spring Boot.

---

## 1️⃣ EmailDataDto.java

**Chemin:** `src/main/java/com/infotech/dto/EmailDataDto.java`

```java
package com.infotech.dto;

public class EmailDataDto {
    private String to;
    private String subject;
    private String htmlContent;

    // Constructeur par défaut (requis pour Jackson)
    public EmailDataDto() {
    }

    // Constructeur avec paramètres
    public EmailDataDto(String to, String subject, String htmlContent) {
        this.to = to;
        this.subject = subject;
        this.htmlContent = htmlContent;
    }

    // Getters
    public String getTo() {
        return to;
    }

    public String getSubject() {
        return subject;
    }

    public String getHtmlContent() {
        return htmlContent;
    }

    // Setters
    public void setTo(String to) {
        this.to = to;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public void setHtmlContent(String htmlContent) {
        this.htmlContent = htmlContent;
    }

    @Override
    public String toString() {
        return "EmailDataDto{" +
                "to='" + to + '\'' +
                ", subject='" + subject + '\'' +
                '}';
    }
}
```

---

## 2️⃣ EmailService.java

**Chemin:** `src/main/java/com/infotech/service/EmailService.java`

```java
package com.infotech.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromEmail;

    /**
     * Envoie un email HTML de manière asynchrone.
     * Le contenu HTML est généré côté frontend et reçu ici.
     * 
     * @param to Adresse email du destinataire
     * @param subject Sujet de l'email
     * @param htmlContent Contenu HTML complet de l'email (généré par Angular)
     * @throws RuntimeException si l'envoi échoue
     */
    @Async
    public void sendEmail(String to, String subject, String htmlContent) {
        logger.info("📧 Préparation d'envoi d'email à: {}", to);
        
        try {
            // Créer le message MIME
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            // Configurer l'expéditeur et le destinataire
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            
            // Définir le contenu HTML (true = format HTML)
            helper.setText(htmlContent, true);

            // Envoyer l'email via le serveur SMTP
            mailSender.send(message);
            
            logger.info("✅ Email envoyé avec succès à: {}", to);

        } catch (MessagingException e) {
            logger.error("❌ Erreur lors de l'envoi de l'email à: {}", to, e);
            throw new RuntimeException("Échec de l'envoi de l'email à " + to, e);
        }
    }

    /**
     * Envoie plusieurs emails (optionnel - pour usage futur)
     */
    @Async
    public void sendBulkEmails(String[] recipients, String subject, String htmlContent) {
        for (String recipient : recipients) {
            try {
                sendEmail(recipient, subject, htmlContent);
            } catch (Exception e) {
                logger.error("Erreur lors de l'envoi à {}: {}", recipient, e.getMessage());
                // Continue avec les autres destinataires
            }
        }
    }
}
```

---

## 3️⃣ EmailController.java

**Chemin:** `src/main/java/com/infotech/controller/EmailController.java`

```java
package com.infotech.controller;

import com.infotech.dto.EmailDataDto;
import com.infotech.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/emails")
@CrossOrigin(origins = "http://localhost:4200")
public class EmailController {

    private static final Logger logger = LoggerFactory.getLogger(EmailController.class);

    @Autowired
    private EmailService emailService;

    /**
     * Endpoint pour envoyer un email.
     * Appelé par le frontend Angular avec le contenu HTML déjà généré.
     * 
     * POST http://localhost:8080/api/emails/send
     * 
     * Body (JSON):
     * {
     *   "to": "user@example.com",
     *   "subject": "Confirmation de commande #12345",
     *   "htmlContent": "<html>...</html>"
     * }
     * 
     * @param emailData Données de l'email (destinataire, sujet, contenu HTML)
     * @return ResponseEntity vide avec statut 200 OK si succès, 400 Bad Request si validation échoue
     */
    @PostMapping("/send")
    public ResponseEntity<Void> sendEmail(@RequestBody EmailDataDto emailData) {
        logger.info("📨 Requête d'envoi d'email reçue: {}", emailData);

        // Validation des données
        if (emailData.getTo() == null || emailData.getTo().trim().isEmpty()) {
            logger.warn("⚠️ Destinataire manquant");
            return ResponseEntity.badRequest().build();
        }

        if (emailData.getSubject() == null || emailData.getSubject().trim().isEmpty()) {
            logger.warn("⚠️ Sujet manquant");
            return ResponseEntity.badRequest().build();
        }

        if (emailData.getHtmlContent() == null || emailData.getHtmlContent().trim().isEmpty()) {
            logger.warn("⚠️ Contenu HTML manquant");
            return ResponseEntity.badRequest().build();
        }

        // Validation basique du format email
        if (!isValidEmail(emailData.getTo())) {
            logger.warn("⚠️ Format d'email invalide: {}", emailData.getTo());
            return ResponseEntity.badRequest().build();
        }

        try {
            // Envoi asynchrone de l'email
            emailService.sendEmail(
                emailData.getTo(),
                emailData.getSubject(),
                emailData.getHtmlContent()
            );

            logger.info("✅ Email mis en file d'envoi pour: {}", emailData.getTo());
            return ResponseEntity.ok().build();

        } catch (Exception e) {
            logger.error("❌ Erreur lors de la mise en file d'envoi: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Endpoint de test pour vérifier la configuration SMTP
     * 
     * GET http://localhost:8080/api/emails/test?email=votre-email@example.com
     */
    @GetMapping("/test")
    public ResponseEntity<String> testEmail(@RequestParam String email) {
        logger.info("🧪 Test d'envoi d'email à: {}", email);

        try {
            String testHtml = """
                <!DOCTYPE html>
                <html>
                <body style="font-family: Arial, sans-serif; padding: 20px;">
                    <h1 style="color: #667eea;">Test Email - InfoTech</h1>
                    <p>Si vous recevez cet email, la configuration SMTP fonctionne correctement ! ✅</p>
                    <p>Vous pouvez maintenant utiliser le système d'envoi d'emails.</p>
                </body>
                </html>
                """;

            emailService.sendEmail(email, "Test Email - InfoTech", testHtml);
            return ResponseEntity.ok("Email de test envoyé à: " + email);

        } catch (Exception e) {
            logger.error("❌ Erreur lors du test d'email: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur: " + e.getMessage());
        }
    }

    /**
     * Validation basique du format email
     */
    private boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        // Regex simple pour validation d'email
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
        return email.matches(emailRegex);
    }
}
```

---

## 4️⃣ Application.java (Modification)

**Chemin:** `src/main/java/com/infotech/InfotechApplication.java`

**Ajouter l'annotation `@EnableAsync`:**

```java
package com.infotech;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync  // ← AJOUTER CETTE LIGNE
public class InfotechApplication {

    public static void main(String[] args) {
        SpringApplication.run(InfotechApplication.class, args);
    }
}
```

---

## 5️⃣ application.properties

**Chemin:** `src/main/resources/application.properties`

**Ajouter cette configuration:**

```properties
# ====================================
# Email Configuration (Gmail SMTP)
# ====================================
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}

# Propriétés SMTP
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.connectiontimeout=5000
spring.mail.properties.mail.smtp.timeout=5000
spring.mail.properties.mail.smtp.writetimeout=5000

# Configuration email application
app.mail.from=noreply@infotech.com

# Debug email (optionnel - à retirer en production)
spring.mail.properties.mail.debug=true
```

---

## 6️⃣ pom.xml (Dépendances)

**Ajouter dans la section `<dependencies>`:**

```xml
<!-- Spring Boot Mail -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

**Dépendances complètes recommandées:**

```xml
<dependencies>
    <!-- Spring Boot Starter Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- Spring Boot Starter Data JPA -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>

    <!-- Spring Boot Starter Mail -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-mail</artifactId>
    </dependency>

    <!-- Spring Boot Starter Security (si utilisé) -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>

    <!-- Base de données (exemple avec MySQL) -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <scope>runtime</scope>
    </dependency>

    <!-- Lombok (optionnel mais recommandé) -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
</dependencies>
```

---

## 7️⃣ Variables d'environnement

### macOS / Linux

Ajouter dans `~/.zshrc` ou `~/.bashrc`:

```bash
export MAIL_USERNAME="votre-email@gmail.com"
export MAIL_PASSWORD="votre-app-password-16-caracteres"
```

Puis recharger:
```bash
source ~/.zshrc
```

### Windows (PowerShell)

```powershell
$env:MAIL_USERNAME="votre-email@gmail.com"
$env:MAIL_PASSWORD="votre-app-password-16-caracteres"
```

### IntelliJ IDEA

1. Ouvrir Run/Debug Configurations
2. Aller dans "Environment variables"
3. Ajouter:
   - `MAIL_USERNAME` = `votre-email@gmail.com`
   - `MAIL_PASSWORD` = `votre-app-password-16-caracteres`

### Eclipse

1. Run → Run Configurations
2. Sélectionner votre application
3. Onglet "Environment"
4. Ajouter les variables

---

## 8️⃣ Génération d'App Password Gmail

### Étapes:

1. **Activer l'authentification à 2 facteurs**
   - Aller sur: https://myaccount.google.com/security
   - Activer "Validation en deux étapes"

2. **Générer un App Password**
   - Aller sur: https://myaccount.google.com/apppasswords
   - Nom de l'application: "InfoTech Backend"
   - Copier le mot de passe généré (16 caractères)

3. **Utiliser le mot de passe**
   - Coller dans `MAIL_PASSWORD` (sans espaces)
   - Ne JAMAIS commiter ce mot de passe dans Git

---

## 9️⃣ Test du système

### 1. Test de configuration SMTP (simple)

Créer un test unitaire:

```java
package com.infotech.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class EmailServiceTest {

    @Autowired
    private EmailService emailService;

    @Test
    void testSendEmail() {
        String testHtml = "<html><body><h1>Test</h1></body></html>";
        
        // Remplacer par votre vrai email
        emailService.sendEmail(
            "votre-email@example.com",
            "Test Email Service",
            testHtml
        );
        
        // Attendre un peu pour l'envoi asynchrone
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        System.out.println("✅ Email envoyé - vérifiez votre boîte de réception");
    }
}
```

### 2. Test via endpoint REST

Démarrer l'application et utiliser curl:

```bash
curl -X GET "http://localhost:8080/api/emails/test?email=votre-email@example.com"
```

Ou via Postman:
- Method: GET
- URL: `http://localhost:8080/api/emails/test?email=votre-email@example.com`

### 3. Test avec le frontend

```bash
# Terminal 1 - Backend
cd /chemin/vers/backend
mvn spring-boot:run

# Terminal 2 - Frontend
cd /Users/emmanuel/Documents/dev/github/infotech-cs
ng serve

# Navigateur
# 1. Aller sur http://localhost:4200/auth/register
# 2. S'inscrire avec votre vrai email
# 3. Vérifier la réception de l'email de bienvenue
```

---

## 🔟 Checklist de déploiement

### Avant de démarrer

- [ ] Java 17+ installé
- [ ] Maven installé
- [ ] Compte Gmail prêt
- [ ] Authentification 2FA activée sur Gmail
- [ ] App Password généré

### Code backend

- [ ] `EmailDataDto.java` créé
- [ ] `EmailService.java` créé
- [ ] `EmailController.java` créé
- [ ] `@EnableAsync` ajouté dans `Application.java`
- [ ] Dépendance `spring-boot-starter-mail` dans `pom.xml`
- [ ] Configuration SMTP dans `application.properties`

### Variables d'environnement

- [ ] `MAIL_USERNAME` configuré
- [ ] `MAIL_PASSWORD` configuré (App Password, pas le mot de passe normal)
- [ ] Variables chargées dans l'IDE/terminal

### Tests

- [ ] Backend démarre sans erreur
- [ ] Endpoint `/api/emails/test` fonctionne
- [ ] Email de test reçu
- [ ] Logs montrent "✅ Email envoyé avec succès"

### Intégration frontend

- [ ] Frontend démarre (`ng serve`)
- [ ] Backend démarre (`mvn spring-boot:run`)
- [ ] CORS configuré correctement
- [ ] Test d'inscription → email de bienvenue reçu
- [ ] Test de commande → email de confirmation reçu

---

## 📊 Logs à surveiller

### Succès

```
📧 Préparation d'envoi d'email à: user@example.com
✅ Email envoyé avec succès à: user@example.com
```

### Erreurs courantes

#### 1. AuthenticationFailedException

```
❌ Erreur lors de l'envoi de l'email à: user@example.com
javax.mail.AuthenticationFailedException: 535-5.7.8 Username and Password not accepted
```

**Solution:** Vérifier `MAIL_USERNAME` et `MAIL_PASSWORD` (utiliser App Password)

#### 2. MessagingException - Connection timeout

```
❌ Erreur lors de l'envoi de l'email
com.sun.mail.util.MailConnectException: Couldn't connect to host, port: smtp.gmail.com, 587
```

**Solution:** Vérifier la connexion Internet, firewall, port 587

#### 3. Variable d'environnement non trouvée

```
Could not resolve placeholder 'MAIL_USERNAME' in value "${MAIL_USERNAME}"
```

**Solution:** Définir les variables d'environnement dans l'IDE ou le terminal

---

## 🚀 Commandes rapides

### Démarrer le backend

```bash
cd /chemin/vers/backend
mvn clean install
mvn spring-boot:run
```

### Vérifier la configuration email

```bash
# Test endpoint
curl http://localhost:8080/api/emails/test?email=votre@email.com

# Vérifier les logs
tail -f logs/spring-boot-logger.log
```

### Rebuild après modifications

```bash
mvn clean package
```

---

## 🎯 Résumé

### Fichiers à créer (3 nouveaux fichiers):
1. `EmailDataDto.java` - DTO pour recevoir les données du frontend
2. `EmailService.java` - Service d'envoi SMTP asynchrone
3. `EmailController.java` - Endpoint REST `/api/emails/send`

### Fichiers à modifier (2 fichiers):
1. `Application.java` - Ajouter `@EnableAsync`
2. `application.properties` - Ajouter configuration SMTP

### Configuration requise:
- Variables d'environnement: `MAIL_USERNAME` et `MAIL_PASSWORD`
- Dépendance Maven: `spring-boot-starter-mail`
- Gmail App Password généré

### Temps estimé: **15-20 minutes** ⏱️

**Après ces étapes, votre système d'email sera 100% fonctionnel ! 🎉**
