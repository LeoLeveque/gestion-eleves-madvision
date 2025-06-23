/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Authentification et autorisation des utilisateurs
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Connexion utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nomPrenom
 *               - mdp
 *             properties:
 *               nomPrenom:
 *                 type: string
 *                 example: "Jean Dupont"
 *               mdp:
 *                 type: string
 *                 format: password
 *                 example: "monmotdepasse"
 *     responses:
 *       200:
 *         description: Connexion réussie, retourne un token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Mot de passe incorrect
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Authentication]
 *     summary: Déconnexion utilisateur (révocation du token)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *       401:
 *         description: Token invalide ou déjà révoqué
 *       403:
 *         description: Token manquant
 */