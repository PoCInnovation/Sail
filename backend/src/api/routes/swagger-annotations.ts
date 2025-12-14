/**
 * Ce fichier contient toutes les annotations Swagger pour les routes de l'API
 * Les annotations sont centralisées ici pour faciliter la maintenance
 */

/**
 * @swagger
 * /api/tokens:
 *   get:
 *     tags: [Tokens]
 *     summary: Get supported tokens
 *     description: Returns a list of all supported tokens from NAVI protocol
 *     responses:
 *       200:
 *         description: List of supported tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: string
 *               example:
 *                 SUI: "0x..."
 *                 USDC: "0x..."
 */

/**
 * @swagger
 * /api/simulate:
 *   post:
 *     tags: [Simulation]
 *     summary: Simulate a DeFi strategy
 *     description: Simulates the execution of a strategy and returns gas estimates and profit/loss
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - strategy
 *               - sender
 *             properties:
 *               strategy:
 *                 $ref: '#/components/schemas/Strategy'
 *               sender:
 *                 type: string
 *                 description: Sender wallet address
 *     responses:
 *       200:
 *         description: Simulation results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 estimated_gas:
 *                   type: number
 *                 estimated_profit_loss:
 *                   type: array
 *                   items:
 *                     type: object
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/validate:
 *   post:
 *     tags: [Validation]
 *     summary: Validate a strategy
 *     description: Validates a strategy structure and returns any errors or warnings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - strategy
 *             properties:
 *               strategy:
 *                 $ref: '#/components/schemas/Strategy'
 *     responses:
 *       200:
 *         description: Validation results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                 warnings:
 *                   type: array
 *                   items:
 *                     type: object
 */

/**
 * @swagger
 * /api/build:
 *   post:
 *     tags: [Build]
 *     summary: Build a transaction from a strategy
 *     description: Builds a Sui transaction from a strategy that can be signed and executed
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - strategy
 *               - sender
 *             properties:
 *               strategy:
 *                 $ref: '#/components/schemas/Strategy'
 *               sender:
 *                 type: string
 *                 description: Sender wallet address
 *     responses:
 *       200:
 *         description: Transaction bytes ready to be signed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 transactionBytes:
 *                   type: string
 *                   description: Base64 encoded transaction bytes
 */

/**
 * @swagger
 * /api/workflows/upload:
 *   post:
 *     tags: [Workflows]
 *     summary: Upload a workflow to the marketplace
 *     description: Encrypts and stores a workflow on Walrus, then adds it to the marketplace
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Strategy'
 *     responses:
 *       200:
 *         description: Workflow uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 workflowId:
 *                   type: string
 *                 metadataBlobId:
 *                   type: string
 */

/**
 * @swagger
 * /api/workflows/list:
 *   get:
 *     tags: [Workflows]
 *     summary: List all marketplace workflows
 *     description: Returns all workflows available in the marketplace
 *     responses:
 *       200:
 *         description: List of workflows
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 workflows:
 *                   type: array
 *                   items:
 *                     type: object
 */

/**
 * @swagger
 * /api/seal/encrypt:
 *   post:
 *     tags: [Seal]
 *     summary: Encrypt and store a file on Walrus
 *     description: Encrypts a file and stores it on Walrus using the Seal protocol
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File encrypted and stored
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     metadataBlobId:
 *                       type: string
 *                     dataBlobId:
 *                       type: string
 *                     nonce:
 *                       type: string
 *                     originalSize:
 *                       type: number
 */

/**
 * @swagger
 * /api/userdata/create-storage:
 *   post:
 *     tags: [User Data]
 *     summary: Create user data storage
 *     description: Creates a new UserDataStorage object on-chain for the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userAddress
 *             properties:
 *               userAddress:
 *                 type: string
 *                 description: User wallet address
 *     responses:
 *       200:
 *         description: Transaction bytes to create storage
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactionBytes:
 *                   type: array
 *                   items:
 *                     type: number
 */

/**
 * @swagger
 * /api/userdata/storage/{address}:
 *   get:
 *     tags: [User Data]
 *     summary: Get user storage object ID
 *     description: Returns the storage object ID for a user address
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: User wallet address
 *     responses:
 *       200:
 *         description: Storage object information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 storageObjectId:
 *                   type: string
 *                   nullable: true
 *                 exists:
 *                   type: boolean
 */

/**
 * @swagger
 * /api/userdata/save-strategy:
 *   post:
 *     tags: [User Data]
 *     summary: Save a strategy on-chain
 *     description: Builds a transaction to save a strategy to the user's on-chain storage
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userAddress
 *               - storageObjectId
 *               - name
 *               - strategyJson
 *             properties:
 *               userAddress:
 *                 type: string
 *               storageObjectId:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               strategyJson:
 *                 type: object
 *     responses:
 *       200:
 *         description: Transaction bytes to save strategy
 */

/**
 * @swagger
 * /api/userdata/strategies/{storageObjectId}:
 *   get:
 *     tags: [User Data]
 *     summary: Get user strategies
 *     description: Returns all strategies saved by the user
 *     parameters:
 *       - in: path
 *         name: storageObjectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of user strategies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 strategies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SavedStrategy'
 */

/**
 * @swagger
 * /api/userdata/delete-strategy:
 *   post:
 *     tags: [User Data]
 *     summary: Delete a strategy
 *     description: Builds a transaction to delete a strategy from on-chain storage
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userAddress
 *               - storageObjectId
 *               - strategyId
 *             properties:
 *               userAddress:
 *                 type: string
 *               storageObjectId:
 *                 type: string
 *               strategyId:
 *                 type: number
 *     responses:
 *       200:
 *         description: Transaction bytes to delete strategy
 */

/**
 * @swagger
 * /api/userdata/record-execution:
 *   post:
 *     tags: [User Data]
 *     summary: Record workflow execution
 *     description: Builds a transaction to record a workflow execution on-chain
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userAddress
 *               - storageObjectId
 *               - workflowName
 *               - status
 *               - txDigest
 *             properties:
 *               userAddress:
 *                 type: string
 *               storageObjectId:
 *                 type: string
 *               workflowName:
 *                 type: string
 *               workflowId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [success, failed, pending]
 *               txDigest:
 *                 type: string
 *               gasUsed:
 *                 type: number
 *               resultData:
 *                 type: object
 *     responses:
 *       200:
 *         description: Transaction bytes to record execution
 */

/**
 * @swagger
 * /api/userdata/history/{storageObjectId}:
 *   get:
 *     tags: [User Data]
 *     summary: Get execution history
 *     description: Returns all workflow executions recorded for the user
 *     parameters:
 *       - in: path
 *         name: storageObjectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Execution history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 history:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ExecutionEntry'
 */

/**
 * @swagger
 * /api/userdata/clear-history:
 *   post:
 *     tags: [User Data]
 *     summary: Clear execution history
 *     description: Builds a transaction to clear all execution history
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userAddress
 *               - storageObjectId
 *             properties:
 *               userAddress:
 *                 type: string
 *               storageObjectId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transaction bytes to clear history
 */
