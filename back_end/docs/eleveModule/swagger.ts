/**
 * @swagger
 * tags:
 *   - name: EleveModule
 *     description: Gestion des modules associés aux élèves
 */

/**
 * @swagger
 * /eleve-modules:
 *   post:
 *     tags: [EleveModule]
 *     summary: Associer un module à un élève
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [eleveId, moduleId]
 *             properties:
 *               eleveId:
 *                 type: integer
 *               moduleId:
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
 * /eleve-modules/{id}:
 *   put:
 *     tags: [EleveModule]
 *     summary: Modifier la somme payée pour un module d'un élève
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
 * /eleve-modules/{id}:
 *   delete:
 *     tags: [EleveModule]
 *     summary: Supprimer le module d'un élève
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
