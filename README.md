# 🎓 Portfolio Certifications - Classe 2026

Portfolio collaboratif pour afficher les certifications **Cisco** et **ANSSI** de votre classe.

## 🚀 Installation Rapide

### Étape 1 : Créer un GitHub Gist

1. Allez sur [gist.github.com](https://gist.github.com)
2. Créez un nouveau Gist **public**
3. Nommez-le `students.json`
4. Contenu initial : `[]`
5. **Notez l'ID du Gist** (dans l'URL : `gist.github.com/username/ID_DU_GIST`)

### Étape 2 : Créer un Token GitHub

1. Allez sur [github.com/settings/tokens](https://github.com/settings/tokens)
2. Cliquez sur **Generate new token (classic)**
3. Permissions nécessaires : cochez **gist**
4. **Copiez le token** (vous ne pourrez plus le voir après)

### Étape 3 : Configurer le Code

Dans `app.js`, lignes 9-10 :
```javascript
const GITHUB_TOKEN = 'ghp_VotreTokenIci';
const GIST_ID = 'VotreGistIdIci';
```

⚠️ **IMPORTANT** : Ne partagez JAMAIS votre token publiquement !

### Étape 4 : Déployer sur GitHub Pages

1. Créez un nouveau repository sur GitHub
2. Uploadez les fichiers : `index.html` et `app.js`
3. Allez dans **Settings → Pages**
4. Source : **Deploy from a branch → main**
5. Votre site sera accessible à : `votre-username.github.io/nom-du-repo`

## 🔐 Sécurité

**Mot de passe par défaut** : `Cisco2026`

Pour le changer, modifiez ligne 2 dans `app.js` :
```javascript
const PASSWORD = 'VotreNouveauMotDePasse';
```

## ✨ Fonctionnalités

✅ Ajout/modification d'étudiants  
✅ Upload de certificats (images)  
✅ Notes pour Cisco et ANSSI  
✅ Tri alphabétique automatique  
✅ Interface responsive (mobile-friendly)  
✅ Protection par mot de passe  

## 📱 Utilisation

1. Connectez-vous avec le mot de passe
2. Cliquez sur **"➕ Ajouter un étudiant"**
3. Remplissez les informations :
   - Nom de l'étudiant (en MAJUSCULES)
   - Note Cisco (optionnel)
   - Image certificat Cisco (optionnel)
   - Note ANSSI (optionnel)
   - Image certificat ANSSI (optionnel)
4. Cliquez sur **"💾 Enregistrer"**

## 🔄 Synchronisation

- Les données sont sauvegardées dans votre Gist GitHub
- Cliquez sur **"🔄 Rafraîchir"** pour voir les nouvelles données
- Tout le monde partage les mêmes données

## ⚠️ Limitations

- **GitHub Gist** : gratuit, 1 GB d'espace
- **Images** : stockées en base64 (limitez la taille)
- **Pas de temps réel** : utilisez le bouton Rafraîchir
- **Sécurité** : token visible dans le code (pour projet étudiant uniquement)

## 🛠️ Améliorations Possibles

Pour un projet en production :
- Utilisez un backend (Node.js, Firebase, Supabase)
- Cachez le token avec des variables d'environnement
- Ajoutez une vraie authentification
- Compressez les images avant upload

## 🎨 Personnalisation

### Changer les couleurs

Dans `index.html`, modifiez le dégradé (lignes 12-13) :
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Modifier le titre

Ligne 275 dans `index.html` :
```html
<h1>🎓 Portfolio des Certifications</h1>
<p class="subtitle">Classe 2026 - Certifications Cisco & ANSSI</p>
```

## 📞 Support

Des problèmes ? Vérifiez :
1. Le token GitHub est valide
2. Le Gist ID est correct
3. Le Gist est **public**
4. Vous avez vidé le cache (Ctrl+Shift+Delete)

## 📄 Licence

Projet étudiant - Utilisation libre pour usage éducatif

---

**Fait avec ❤️ par la Classe 2026**
