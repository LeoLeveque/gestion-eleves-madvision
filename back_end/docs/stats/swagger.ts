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
 */

/**
 * @swagger
 * /stats/modules-plus-suis:
 *   get:
 *     tags: [Statistiques]
 *     summary: Modules les plus suivis (triés par nombre d'élèves)
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