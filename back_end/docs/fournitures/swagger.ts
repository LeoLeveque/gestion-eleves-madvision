/**
 * @swagger
 * tags:
 *   - name: Fourniture
 *     description: Gestion des fournitures.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Fourniture:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         nom:
 *           type: string
 *         prix:
 *           type: number
 *           format: float
 *       required:
 *         - nom
 *         - prix
 *       example:
 *         id: 1
 *         nom: "Clé USB 32Go"
 *         prix: 10.99
 */

/**
 * @swagger
 * /fournitures:
 *   get:
 *     summary: Récupérer toutes les fournitures.
 *     tags: [Fourniture]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de toutes les fournitures.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Fourniture'
 *       401:
 *         description: Non authentifié.
 *
 *   post:
 *     summary: Créer une nouvelle fourniture.
 *     tags: [Fourniture]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Fourniture'
 *     responses:
 *       201:
 *         description: Fourniture créée.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Fourniture'
 *       400:
 *         description: Paramètres invalides.
 *       401:
 *         description: Non authentifié.
 */

/**
 * @swagger
 * /fournitures/{id}:
 *   get:
 *     summary: Récupérer une fourniture par ID.
 *     tags: [Fourniture]
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
 *         description: Fourniture trouvée.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Fourniture'
 *       401:
 *         description: Non authentifié.
 *       404:
 *         description: Fourniture introuvable.
 *
 *   put:
 *     summary: Mettre à jour une fourniture.
 *     tags: [Fourniture]
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
 *             $ref: '#/components/schemas/Fourniture'
 *     responses:
 *       200:
 *         description: Fourniture mise à jour.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Fourniture'
 *       400:
 *         description: Paramètres invalides.
 *       401:
 *         description: Non authentifié.
 *       404:
 *         description: Fourniture introuvable.
 *
 *   delete:
 *     summary: Supprimer une fourniture.
 *     tags: [Fourniture]
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
 *         description: Fourniture introuvable.
 */
