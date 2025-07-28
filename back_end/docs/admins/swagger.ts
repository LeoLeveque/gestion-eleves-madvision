/**
 * @swagger
 * tags:
 *   - name: Admins
 *     description: Gestion des administrateurs (super admins uniquement sauf modification mdp par admins classique)
 */

/**
 * @swagger
 * /admins:
 *   get:
 *     tags: [Admins]
 *     summary: Liste des administrateurs (super admins uniquement)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des administrateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nomPrenom:
 *                     type: string
 *                   isSuperAdmin:
 *                     type: boolean
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé (non super admins)
 */

/**
 * @swagger
 * /admins:
 *   post:
 *     tags: [Admins]
 *     summary: Création d'un nouvel administrateur (super admins uniquement)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Informations de l'administrateur à créer
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
 *                 example: "Alice Martin"
 *               mdp:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Administrateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nomPrenom:
 *                   type: string
 *                 isSuperAdmin:
 *                   type: boolean
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé (non super admins)
 */

/**
 * @swagger
 * /admins/{id}:
 *   put:
 *     tags: [Admins]
 *     summary: Modification d'un administrateur
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de l'administrateur à modifier
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Données à modifier
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomPrenom:
 *                 type: string
 *                 example: "Alice Martin"
 *               mdp:
 *                 type: string
 *                 format: password
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Administrateur modifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nomPrenom:
 *                   type: string
 *                 isSuperAdmin:
 *                   type: boolean
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé (modification interdite pour admins classique hors propre mdp)
 *       404:
 *         description: Administrateur non trouvé
 */

/**
 * @swagger
 * /admins/{id}:
 *   delete:
 *     tags:
 *       - Admins
 *     summary: Supprimer un admins par son identifiant
 *     description: Supprime un utilisateur admins. Accessible uniquement aux super admins.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'administrateur à supprimer
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Administrateur supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin supprimé
 *       401:
 *         description: Non authentifié ou token invalide
 *       404:
 *         description: Admin non trouvé
 *       500:
 *         description: Erreur serveur
 */