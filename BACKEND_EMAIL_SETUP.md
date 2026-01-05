# 📧 Configuration Backend pour le Système d'Email

## Vue d'ensemble

Ce document explique comment implémenter le système d'email côté backend pour fonctionner avec le frontend Angular.

---

## 1. Dépendances Maven (pom.xml)

```xml
<!-- Spring Boot Mail -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

**Note:** Vous pouvez **supprimer** Thymeleaf si vous l'aviez ajouté, car les templates HTML sont gérés côté frontend.

---

## 2. Configuration SMTP (application.properties)

```properties
# Email Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true

# Application Email Settings
app.mail.from=noreply@infotech.com
```

### Variables d'environnement

Dans votre IDE ou système :
```bash
MAIL_USERNAME=votre-email@gmail.com
MAIL_PASSWORD=votre-app-password-16-caracteres
```

> **Important:** Utilisez un "App Password" Google, pas votre mot de passe habituel.
> Générer ici: https://myaccount.google.com/apppasswords

---

## 3. DTO pour recevoir les emails du frontend

```java
package com.infotech.dto;

public class EmailDataDto {
    private String to;
    private String subject;
    private String htmlContent;

    // Constructeurs
    public EmailDataDto() {}

    public EmailDataDto(String to, String subject, String htmlContent) {
        this.to = to;
        this.subject = subject;
        this.htmlContent = htmlContent;
    }

    // Getters et Setters
    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getHtmlContent() {
        return htmlContent;
    }

    public void setHtmlContent(String htmlContent) {
        this.htmlContent = htmlContent;
    }
}
```

---

## 4. Service d'envoi d'emails (EmailService.java)

```java
package com.infotech.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromEmail;

    /**
     * Envoie un email HTML de manière asynchrone
     * 
     * @param to Destinataire
     * @param subject Sujet de l'email
     * @param htmlContent Contenu HTML (généré par le frontend)
     */
    @Async
    public void sendEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // true = HTML

            mailSender.send(message);
            logger.info("✅ Email envoyé avec succès à: {}", to);

        } catch (MessagingException e) {
            logger.error("❌ Erreur lors de l'envoi de l'email à: {}", to, e);
            throw new RuntimeException("Échec de l'envoi de l'email", e);
        }
    }
}
```

---

## 5. Contrôleur REST (EmailController.java)

```java
package com.infotech.controller;

import com.infotech.dto.EmailDataDto;
import com.infotech.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/emails")
@CrossOrigin(origins = "http://localhost:4200")
public class EmailController {

    @Autowired
    private EmailService emailService;

    /**
     * Endpoint appelé par le frontend pour envoyer un email
     * 
     * POST http://localhost:8080/api/emails/send
     * Body: { "to": "user@example.com", "subject": "...", "htmlContent": "..." }
     */
    @PostMapping("/send")
    public ResponseEntity<Void> sendEmail(@RequestBody EmailDataDto emailData) {
        
        // Validation basique
        if (emailData.getTo() == null || emailData.getTo().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        if (emailData.getSubject() == null || emailData.getSubject().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        if (emailData.getHtmlContent() == null || emailData.getHtmlContent().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Envoi asynchrone de l'email
        emailService.sendEmail(
            emailData.getTo(), 
            emailData.getSubject(), 
            emailData.getHtmlContent()
        );

        return ResponseEntity.ok().build();
    }
}
```

---

## 6. Activer l'exécution asynchrone (Application.java)

```java
package com.infotech;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync  // ← Ajouter cette annotation
public class InfotechApplication {

    public static void main(String[] args) {
        SpringApplication.run(InfotechApplication.class, args);
    }
}
```

---

## 7. Architecture du système

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Angular)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  EmailService.ts                                                 │
│  ├─ sendOrderConfirmation()                                     │
│  │   ├─ Construit le HTML avec buildOrderConfirmationEmail()   │
│  │   └─ POST /api/emails/send                                   │
│  │                                                               │
│  ├─ sendWelcomeEmail()                                          │
│  │   ├─ Construit le HTML avec buildWelcomeEmail()             │
│  │   └─ POST /api/emails/send                                   │
│  │                                                               │
│  ├─ sendPasswordResetEmail()                                    │
│  │   ├─ Construit le HTML avec buildPasswordResetEmail()       │
│  │   └─ POST /api/emails/send                                   │
│  │                                                               │
│  └─ sendShippingNotification()                                  │
│      ├─ Construit le HTML avec buildShippingEmail()            │
│      └─ POST /api/emails/send                                   │
│                                                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP POST
                         │ { to, subject, htmlContent }
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND (Spring Boot)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  EmailController.java                                            │
│  └─ POST /api/emails/send                                       │
│      └─ Reçoit EmailDataDto                                     │
│          └─ Appelle EmailService.sendEmail()                    │
│                                                                  │
│  EmailService.java                                               │
│  └─ @Async sendEmail()                                          │
│      ├─ Crée MimeMessage                                        │
│      ├─ Configure le contenu HTML                               │
│      └─ Envoie via JavaMailSender                               │
│                                                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │ SMTP
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Gmail SMTP (smtp.gmail.com)                    │
│                    ├─ Port: 587                                  │
│                    ├─ TLS: Activé                                │
│                    └─ Authentification: App Password             │
│                                                                  │
│                           ▼                                      │
│                   📧 Email livré au destinataire                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Points d'intégration dans le frontend

### ✅ Déjà implémenté

1. **Inscription utilisateur** (`register.component.ts`)
   - Envoie automatiquement un email de bienvenue après inscription
   
2. **Création de commande** (`checkout.component.ts`)
   - Envoie automatiquement un email de confirmation après paiement
   
3. **Page de confirmation** (`order-confirmation.component.ts`)
   - Bouton "Renvoyer l'email" pour envoyer manuellement l'email

### 📋 À implémenter (optionnel)

4. **Notification d'expédition**
   - Depuis le dashboard vendeur ou admin
   - Utiliser `emailService.sendShippingNotification()`

5. **Réinitialisation de mot de passe**
   - Page "Mot de passe oublié"
   - Utiliser `emailService.sendPasswordResetEmail()`

---

## 9. Avantages de cette approche

### ✅ Ce qui est MIEUX qu'avec Thymeleaf

1. **Pas de duplication de templates**
   - Un seul endroit pour les templates HTML (Angular)
   - Pas de maintenance de fichiers .html Thymeleaf séparés

2. **Moins de dépendances backend**
   - Pas besoin de Thymeleaf dans le pom.xml
   - Backend plus léger et simple

3. **Prévisualisation facile**
   - Les templates sont en TypeScript
   - On peut facilement les tester/visualiser

4. **Type-safety**
   - TypeScript garantit que les données sont correctes
   - Moins d'erreurs à l'exécution

5. **Séparation des responsabilités**
   - Frontend = présentation/contenu
   - Backend = envoi/infrastructure

### ⚖️ Compromis

- Le HTML est dans le body de la requête HTTP (un peu plus de données)
- Mais avec la compression HTTP, l'impact est négligeable

---

## 10. Checklist de déploiement

### Backend

- [ ] Dépendances Maven installées
- [ ] `application.properties` configuré
- [ ] Variables d'environnement `MAIL_USERNAME` et `MAIL_PASSWORD` définies
- [ ] `@EnableAsync` activé dans la classe principale
- [ ] EmailService créé
- [ ] EmailController créé avec endpoint `/api/emails/send`
- [ ] EmailDataDto créé

### Gmail

- [ ] Compte Gmail créé (ou utiliser un existant)
- [ ] Authentification à 2 facteurs activée
- [ ] App Password généré (16 caractères)
- [ ] App Password ajouté dans `MAIL_PASSWORD`

### Frontend (déjà fait ✅)

- [x] EmailService créé avec tous les templates
- [x] Intégration dans RegisterComponent
- [x] Intégration dans CheckoutComponent
- [x] Intégration dans OrderConfirmationComponent

---

## 11. Test du système

### Test manuel

1. **Inscription**
   ```
   1. Aller sur http://localhost:4200/auth/register
   2. S'inscrire avec un vrai email
   3. Vérifier la réception de l'email de bienvenue
   ```

2. **Commande**
   ```
   1. Ajouter des produits au panier
   2. Aller au checkout
   3. Remplir les informations
   4. Valider la commande
   5. Vérifier la réception de l'email de confirmation
   ```

3. **Renvoi manuel**
   ```
   1. Aller sur la page de confirmation de commande
   2. Cliquer sur "Renvoyer l'email de confirmation"
   3. Vérifier la réception
   ```

### Logs à surveiller

**Backend:**
```
✅ Email envoyé avec succès à: user@example.com
```

**Frontend (console):**
```
✅ Email de confirmation envoyé
✅ Email de bienvenue envoyé
```

---

## 12. Résolution de problèmes

### Erreur: "AuthenticationFailedException"

**Solution:**
- Vérifier que l'App Password est correct (16 caractères sans espaces)
- Vérifier que l'authentification à 2 facteurs est activée
- Vérifier `MAIL_USERNAME` = votre email complet

### Erreur: "MessagingException"

**Solution:**
- Vérifier la connexion Internet
- Vérifier que le port 587 n'est pas bloqué par un firewall
- Tester avec Telnet: `telnet smtp.gmail.com 587`

### Email non reçu

**Solution:**
- Vérifier les spams
- Vérifier les logs backend pour les erreurs
- Vérifier que l'email destinataire est valide
- Tester avec un autre email

---

## 13. Sécurité

### ✅ Bonnes pratiques appliquées

1. **Variables d'environnement**
   - Mot de passe jamais dans le code
   - Configuration externalisée

2. **Envoi asynchrone**
   - N'impacte pas les performances de l'API
   - L'utilisateur ne attend pas l'envoi de l'email

3. **Validation**
   - Vérification des champs obligatoires
   - Protection contre les injections

### 🔒 Améliorations possibles (production)

1. **Rate limiting**
   ```java
   @RateLimiter(name = "emailLimiter")
   public void sendEmail(...) { ... }
   ```

2. **Queue d'emails**
   - Utiliser RabbitMQ ou Redis
   - Retry automatique en cas d'échec

3. **Vérification d'email**
   - Validation du format
   - Vérification du domaine MX

4. **Templates sécurisés**
   - Échapper le contenu utilisateur
   - Sanitization HTML

---

## Conclusion

Le système d'email est maintenant entièrement géré côté frontend pour les templates, et côté backend uniquement pour l'envoi SMTP. C'est une architecture **simple, maintenable et efficace**.

### Ce qui a été fait côté frontend ✅

- Service `EmailService` avec 4 types d'emails
- Templates HTML professionnels et responsive
- Intégration automatique à l'inscription
- Intégration automatique à la commande
- Bouton manuel de renvoi d'email

### Ce qu'il reste à faire côté backend 🔧

- Créer `EmailController.java`
- Créer `EmailService.java`
- Créer `EmailDataDto.java`
- Configurer `application.properties`
- Activer `@EnableAsync`

**Temps estimé: 15-20 minutes** ⏱️
