/**
 * @swagger
 * tags:
 *   - name: Module
 *     description: Gestion des modules.
 * components:
 *   schemas:
 *     Module:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         nom:
 *           type: string
 *         filiereId:
 *           type: integer
 *       required:
 *         - nom
 *         - filiereId
 *       example:
 *         id: 1
 *         nom: "Algorithmes"
 *         filiereId: 1
 *
 * /modules:
 *   get:
 *     summary: Récupérer tous les modules.
 *     tags: [Module]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de tous les modules.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Module'
 *       401:
 *         description: Non authentifié (token manquant ou invalide).
 *
 *   post:
 *     summary: Créer un nouveau module.
 *     tags: [Module]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Module'
 *     responses:
 *       201:
 *         description: Module créé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Module'
 *       400:
 *         description: Paramètres invalides.
 *       401:
 *         description: Non authentifié (token manquant ou invalide).
 *
 * /modules/{id}:
 *   get:
 *     summary: Récupérer un module par son ID.
 *     tags: [Module]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du module.
 *     responses:
 *       200:
 *         description: Module trouvé.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Module'
 *       401:
 *         description: Non authentifié (token manquant ou invalide).
 *       404:
 *         description: Module introuvable.
 *
 *   put:
 *     summary: Mettre à jour un module existant.
 *     tags: [Module]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du module.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Module'
 *     responses:
 *       200:
 *         description: Module mis à jour avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Module'
 *       400:
 *         description: Paramètres invalides.
 *       401:
 *         description: Non authentifié (token manquant ou invalide).
 *       404:
 *         description: Module introuvable.
 *
 *   delete:
 *     summary: Supprimer un module.
 *     tags: [Module]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du module.
 *     responses:
 *       204:
 *         description: Module supprimé avec succès (pas de contenu retourné).
 *       401:
 *         description: Non authentifié (token manquant ou invalide).
 *       404:
 *         description: Module introuvable.
 */
