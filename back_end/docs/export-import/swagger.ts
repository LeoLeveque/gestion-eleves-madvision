/**
 * @swagger
 * tags:
 *   - name: ExportImport
 *     description: Import et export de données CSV
 */

/**
 * @swagger
 * /export-import/import/csv:
 *   post:
 *     tags: [ExportImport]
 *     summary: Importer des élèves depuis un fichier CSV
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Import terminé
 *       400:
 *         description: Aucun fichier fourni ou erreur d'import
 */

/**
 * @swagger
 * /export-import/export/csv:
 *   get:
 *     tags: [ExportImport]
 *     summary: Exporter toutes les données élèves au format CSV
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Fichier CSV généré
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 */
