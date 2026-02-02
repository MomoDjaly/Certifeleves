// ⚠️ CONFIGURATION - À MODIFIER AVANT LE DÉPLOIEMENT
const PASSWORD = 'Cisco2026';

// 🔐 IMPORTANT : Ne mettez JAMAIS votre token directement dans ce fichier !
// Utilisez plutôt l'une de ces méthodes :
// 1. GitHub Actions Secrets (recommandé pour production)
// 2. Variables d'environnement
// 3. Backend séparé

// Pour le développement local uniquement :
const GITHUB_TOKEN = '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'; // Générer sur https://github.com/settings/tokens
const GIST_ID = 'bbf8bab768fff37c17d8b308f6b58356'; // L'ID du Gist (long code après /gists/)

let students = [];

// Charger les données depuis GitHub Gist
async function loadData() {
    const loading = document.getElementById('loading');
    loading.style.display = 'block';
    
    try {
        const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const gistData = await response.json();
        const fileContent = gistData.files['students.json']?.content;
        
        if (fileContent) {
            students = JSON.parse(fileContent);
            console.log(`✅ ${students.length} étudiants chargés`);
        } else {
            students = [];
            console.log('✅ Aucune donnée existante');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('❌ Erreur de chargement. Vérifiez votre configuration Gist.');
    }
    
    loading.style.display = 'none';
    displayStudents();
}

// Sauvegarder les données sur GitHub Gist
async function saveData() {
    console.log(`💾 Sauvegarde de ${students.length} étudiants...`);
    
    try {
        const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                files: {
                    'students.json': {
                        content: JSON.stringify(students, null, 2)
                    }
                }
            })
        });
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        console.log('✅ Données sauvegardées !');
        return true;
    } catch (error) {
        console.error('Erreur:', error);
        alert('❌ Erreur de sauvegarde. Vérifiez votre token et Gist ID.');
        return false;
    }
}

// Pas de temps réel avec Gist - utiliser le bouton Rafraîchir
function listenToChanges() {
    console.log('💡 Avec GitHub Gist, cliquez sur "Rafraîchir" pour voir les changements');
}

// Connexion
document.addEventListener('DOMContentLoaded', async function() {
    const isAuth = localStorage.getItem('authenticated');
    
    if (isAuth === 'true') {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('mainPage').style.display = 'block';
        await loadData();
    }
    
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('loginError');
        
        if (password === PASSWORD) {
            localStorage.setItem('authenticated', 'true');
            document.getElementById('loginPage').style.display = 'none';
            document.getElementById('mainPage').style.display = 'block';
            await loadData();
        } else {
            errorDiv.textContent = '❌ Mot de passe incorrect';
            errorDiv.style.display = 'block';
            document.getElementById('password').value = '';
        }
    });
    
    // Gestion du formulaire étudiant
    document.getElementById('studentForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        const editIndex = document.getElementById('editIndex').value;
        const nom = document.getElementById('nom').value.toUpperCase().trim();
        const note_cisco = document.getElementById('note_cisco').value.trim();
        const note_anssi = document.getElementById('note_anssi').value.trim();
        const file_cisco = document.getElementById('image_cisco').files[0];
        const file_anssi = document.getElementById('image_anssi').files[0];

        if (editIndex !== '') {
            const index = parseInt(editIndex);
            const student = students[index];
            
            student.nom = nom;
            student.note_cisco = note_cisco || null;
            student.note_anssi = note_anssi || null;
            
            if (file_cisco) {
                student.image_cisco = await toBase64(file_cisco);
            }
            if (file_anssi) {
                student.image_anssi = await toBase64(file_anssi);
            }
            
            console.log(`✏️ Étudiant modifié : ${student.nom}`);
            
        } else {
            let image_cisco = null;
            let image_anssi = null;

            if (file_cisco) {
                image_cisco = await toBase64(file_cisco);
            }
            if (file_anssi) {
                image_anssi = await toBase64(file_anssi);
            }

            const existingIndex = students.findIndex(s => s.nom === nom);
            
            if (existingIndex !== -1) {
                students[existingIndex].note_cisco = note_cisco || null;
                students[existingIndex].note_anssi = note_anssi || null;
                if (file_cisco) students[existingIndex].image_cisco = image_cisco;
                if (file_anssi) students[existingIndex].image_anssi = image_anssi;
                console.log(`🔄 Mis à jour : ${nom}`);
            } else {
                students.push({
                    nom: nom,
                    note_cisco: note_cisco || null,
                    note_anssi: note_anssi || null,
                    image_cisco: image_cisco,
                    image_anssi: image_anssi,
                    createdAt: new Date().toISOString()
                });
                console.log(`✅ Ajouté : ${nom}`);
            }
        }

        const success = await saveData();
        if (success) {
            closeForm();
            alert('✅ Enregistré avec succès !');
        }
    });

    window.onclick = function(event) {
        const formModal = document.getElementById('formModal');
        const imageModal = document.getElementById('imageModal');
        
        if (event.target == formModal) {
            closeForm();
        }
        if (event.target == imageModal) {
            closeModal();
        }
    }
});

function logout() {
    localStorage.removeItem('authenticated');
    document.getElementById('loginPage').style.display = 'block';
    document.getElementById('mainPage').style.display = 'none';
    document.getElementById('password').value = '';
}

function displayStudents() {
    const grid = document.getElementById('studentGrid');
    const emptyState = document.getElementById('emptyState');
    
    grid.innerHTML = '';

    if (students.length === 0) {
        grid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    grid.style.display = 'grid';
    emptyState.style.display = 'none';

    const sortedStudents = [...students].sort((a, b) => a.nom.localeCompare(b.nom));

    sortedStudents.forEach((student, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-header">
                <h2>${student.nom}</h2>
                <button class="edit-btn" onclick="editStudent(${students.indexOf(student)})">
                    ✏️ Modifier
                </button>
            </div>
            
            <div class="certif">
                <h3>📘 CISCO</h3>
                ${student.note_cisco ? 
                    `<div class="note">Note : ${student.note_cisco}</div>` : 
                    '<div class="no-data">Pas encore de note</div>'
                }
                ${student.image_cisco ? 
                    `<img src="${student.image_cisco}" alt="Certificat Cisco" onclick="openImage('${student.image_cisco}')">` : 
                    '<div class="no-data">Pas encore d\'image</div>'
                }
            </div>
            
            <div class="certif">
                <h3>🔷 ANSSI</h3>
                ${student.note_anssi ? 
                    `<div class="note">Note : ${student.note_anssi}</div>` : 
                    '<div class="no-data">Pas encore de note</div>'
                }
                ${student.image_anssi ? 
                    `<img src="${student.image_anssi}" alt="Certificat ANSSI" onclick="openImage('${student.image_anssi}')">` : 
                    '<div class="no-data">Pas encore d\'image</div>'
                }
            </div>
        `;
        grid.appendChild(card);
    });
}

function openForm() {
    document.getElementById('formModal').style.display = 'block';
    document.getElementById('formTitle').textContent = 'Ajouter un étudiant';
    document.getElementById('studentForm').reset();
    document.getElementById('editIndex').value = '';
    document.getElementById('current_image_cisco').innerHTML = '';
    document.getElementById('current_image_anssi').innerHTML = '';
}

function editStudent(index) {
    const student = students[index];
    
    document.getElementById('formModal').style.display = 'block';
    document.getElementById('formTitle').textContent = 'Modifier un étudiant';
    document.getElementById('editIndex').value = index;
    
    document.getElementById('nom').value = student.nom;
    document.getElementById('note_cisco').value = student.note_cisco || '';
    document.getElementById('note_anssi').value = student.note_anssi || '';
    
    if (student.image_cisco) {
        document.getElementById('current_image_cisco').innerHTML = 
            `<small style="color: #667eea;">Image actuelle Cisco :</small><br>
            <img src="${student.image_cisco}" style="max-width: 100px; border-radius: 8px; margin-top: 5px;">`;
    }
    
    if (student.image_anssi) {
        document.getElementById('current_image_anssi').innerHTML = 
            `<small style="color: #667eea;">Image actuelle ANSSI :</small><br>
            <img src="${student.image_anssi}" style="max-width: 100px; border-radius: 8px; margin-top: 5px;">`;
    }
}

function closeForm() {
    document.getElementById('formModal').style.display = 'none';
    document.getElementById('studentForm').reset();
}

function openImage(src) {
    document.getElementById('imageModal').style.display = 'block';
    document.getElementById('modalImage').src = src;
}

function closeModal() {
    document.getElementById('imageModal').style.display = 'none';
}

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

async function refreshData() {
    const btn = event.target;
    btn.disabled = true;
    btn.textContent = '⏳ Chargement...';
    
    await loadData();
    
    btn.disabled = false;
    btn.textContent = '🔄 Rafraîchir';
}

// Rendre les fonctions globales
window.openForm = openForm;
window.editStudent = editStudent;
window.closeForm = closeForm;
window.openImage = openImage;
window.closeModal = closeModal;
window.logout = logout;
window.refreshData = refreshData;
