/**
 * @swagger
 * tags:
 *   - name: EleveFourniture
 *     description: Gestion des fournitures associées aux élèves
 */

/**
 * @swagger
 * /eleve-fournitures:
 *   post:
 *     tags: [EleveFourniture]
 *     summary: Associer une fourniture à un élève
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [eleveId, fournitureId]
 *             properties:
 *               eleveId:
 *                 type: integer
 *               fournitureId:
 *                 type: integer
 *               paye:
 *                 type: number
 *                 default: 0
 *     responses:
 *       201:
 *         description: Relation créée
 *       400:
 *         description: Erreur lors de la création
 */

/**
 * @swagger
 * /eleve-fournitures/{id}:
 *   put:
 *     tags: [EleveFourniture]
 *     summary: Modifier la somme payée pour une fourniture d'un élève
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
 *               paye:
 *                 type: number
 *     responses:
 *       200:
 *         description: Relation modifiée
 *       400:
 *         description: Erreur lors de la modification
 */

/**
 * @swagger
 * /eleve-fournitures/{id}:
 *   delete:
 *     tags: [EleveFourniture]
 *     summary: Supprimer la fourniture d'un élève
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Relation supprimée
 *       400:
 *         description: Erreur lors de la suppression
 */
