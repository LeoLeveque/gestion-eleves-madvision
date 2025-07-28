/**
 * @swagger
 * tags:
 *   - name: Élèves
 *     description: Gestion des élèves et de leurs relations (modules, fournitures, reçus)
 */

/**
 * @swagger
 * /eleves:
 *   get:
 *     tags: [Élèves]
 *     summary: Récupère la liste des élèves avec filtres, pagination, tri et somme due
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: nomPrenom
 *         schema:
 *           type: string
 *       - in: query
 *         name: telephone
 *         schema:
 *           type: string
 *       - in: query
 *         name: adresse
 *         schema:
 *           type: string
 *       - in: query
 *         name: typeCours
 *         schema:
 *           type: string
 *       - in: query
 *         name: module
 *         schema:
 *           type: string
 *       - in: query
 *         name: filiere
 *         schema:
 *           type: string
 *       - in: query
 *         name: dateNaissanceFrom
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: dateNaissanceTo
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: dateEntreeFrom
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: dateEntreeTo
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des élèves récupérée avec succès
 */

/**
 * @swagger
 * /eleves/{id}:
 *   get:
 *     tags: [Élèves]
 *     summary: Récupère un élève complet avec ses relations
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
 *         description: Élève récupéré avec succès
 *       404:
 *         description: Élève introuvable
 */

/**
 * @swagger
 * /eleves:
 *   post:
 *     tags: [Élèves]
 *     summary: Crée un nouvel élève avec ses modules, fournitures et reçus
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nomPrenom
 *               - dateNaissance
 *               - telephone
 *               - adresse
 *               - dateEntree
 *               - typeCours
 *               - filiereId
 *             properties:
 *               nomPrenom:
 *                 type: string
 *               dateNaissance:
 *                 type: string
 *                 format: date
 *               telephone:
 *                 type: string
 *               adresse:
 *                 type: string
 *               dateEntree:
 *                 type: string
 *                 format: date
 *               typeCours:
 *                 type: string
 *               filiereId:
 *                 type: integer
 *               moduleIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *               fournitureIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *               recus:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: Élève créé avec succès
 *       400:
 *         description: Erreur lors de la création
 */

/**
 * @swagger
 * /eleves/{id}/ajouter-relations:
 *   patch:
 *     tags: [Élèves]
 *     summary: Ajoute des relations à un élève existant (modules, fournitures, reçus)
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
 *               modules:
 *                 type: array
 *                 items:
 *                   type: object
 *               fournitures:
 *                 type: array
 *                 items:
 *                   type: object
 *               recus:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Relations ajoutées avec succès
 *       400:
 *         description: Erreur lors de l'ajout
 */

/**
 * @swagger
 * /eleves/{id}:
 *   put:
 *     tags: [Élèves]
 *     summary: Met à jour un élève et ses relations
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
 *               nomPrenom:
 *                 type: string
 *               dateNaissance:
 *                 type: string
 *               telephone:
 *                 type: string
 *               adresse:
 *                 type: string
 *               dateEntree:
 *                 type: string
 *               typeCours:
 *                 type: string
 *               filiereId:
 *                 type: integer
 *               modules:
 *                 type: array
 *                 items:
 *                   type: object
 *               fournitures:
 *                 type: array
 *                 items:
 *                   type: object
 *               recuIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Élève mis à jour avec succès
 *       400:
 *         description: Erreur de mise à jour
 */

/**
 * @swagger
 * /eleves/{id}:
 *   delete:
 *     tags: [Élèves]
 *     summary: Supprime un élève et toutes ses relations
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
 *         description: Élève supprimé avec succès
 *       404:
 *         description: Élève introuvable
 */
