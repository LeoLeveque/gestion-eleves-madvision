/**
 * @swagger
 * tags:
 *   - name: Statistiques
 *     description: Routes pour les statistiques des élèves
 */

/**
 * @swagger
 * /stats/eleves-par-filiere:
 *   get:
 *     tags: [Statistiques]
 *     summary: Nombre d'élèves par filière
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des filières avec nombre d'élèves
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   filiere:
 *                     type: string
 *                   nombreEleves:
 *                     type: integer
 */

/**
 * @swagger
 * /stats/montant-total-encaisse:
 *   get:
 *     tags: [Statistiques]
 *     summary: Montant total encaissé (somme des reçus)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Montant total encaissé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 montantTotal:
 *                   type: number
 *                   format: float
 */

/**
 * @swagger
 * /stats/eleves-en-retard:
 *   get:
 *     tags: [Statistiques]
 *     summary: Élèves ayant des paiements en retard
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des élèves en retard de paiement
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   eleve:
 *                     type: string
 *                   montantRestant:
 *                     type: number
 */

/**
 * @swagger
 * /stats/modules-plus-suis:
 *   get:
 *     tags: [Statistiques]
 *     summary: Modules les plus suivis (triés par nombre d'élèves)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des modules avec nombre d'élèves inscrits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   module:
 *                     type: string
 *                   nombreEleves:
 *                     type: integer
 */
