/**
 * @swagger
 * tags:
 *   - name: Filiere
 *     description: Gestion des filières.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Filiere:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         nom:
 *           type: string
 *       required:
 *         - nom
 *       example:
 *         id: 1
 *         nom: "Informatique"
 */

/**
 * @swagger
 * /filieres:
 *   get:
 *     summary: Récupérer toutes les filières.
 *     tags: [Filiere]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de toutes les filières.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Filiere'
 *       401:
 *         description: Non authentifié.
 *
 *   post:
 *     summary: Créer une nouvelle filière.
 *     tags: [Filiere]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Filiere'
 *     responses:
 *       201:
 *         description: Filière créée.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Filiere'
 *       400:
 *         description: Paramètres invalides.
 *       401:
 *         description: Non authentifié.
 */

/**
 * @swagger
 * /filieres/{id}:
 *   get:
 *     summary: Récupérer une filière par son ID.
 *     tags: [Filiere]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Filière trouvée.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Filiere'
 *       401:
 *         description: Non authentifié.
 *       404:
 *         description: Filière introuvable.
 *
 *   put:
 *     summary: Mettre à jour une filière.
 *     tags: [Filiere]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Filiere'
 *     responses:
 *       200:
 *         description: Filière mise à jour.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Filiere'
 *       400:
 *         description: Paramètres invalides.
 *       401:
 *         description: Non authentifié.
 *       404:
 *         description: Filière introuvable.
 *
 *   delete:
 *     summary: Supprimer une filière.
 *     tags: [Filiere]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Suppression réussie (pas de contenu).
 *       401:
 *         description: Non authentifié.
 *       404:
 *         description: Filière introuvable.
 */
