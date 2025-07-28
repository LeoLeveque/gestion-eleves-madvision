/**
 * @swagger
 * tags:
 *   - name: Recus
 *     description: Gestion des reçus de paiement
 */

/**
 * @swagger
 * /recus:
 *   get:
 *     tags: [Recus]
 *     summary: Liste des reçus
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des reçus
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */

/**
 * @swagger
 * /recus:
 *   post:
 *     tags: [Recus]
 *     summary: Créer un nouveau reçu
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [eleveId, montant, motif]
 *             properties:
 *               eleveId:
 *                 type: integer
 *               montant:
 *                 type: number
 *               motif:
 *                 type: string
 *     responses:
 *       201:
 *         description: Reçu créé
 */

/**
 * @swagger
 * /recus/{id}:
 *   get:
 *     tags: [Recus]
 *     summary: Détail d'un reçu
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détail du reçu
 */

/**
 * @swagger
 * /recus/{id}:
 *   put:
 *     tags: [Recus]
 *     summary: Modifier un reçu
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               montant:
 *                 type: number
 *               motif:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reçu mis à jour
 */

/**
 * @swagger
 * /recus/{id}:
 *   delete:
 *     tags: [Recus]
 *     summary: Supprimer un reçu
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reçu supprimé
 */
