const express = require('express');
const router = express.Router();
const casosController = require('../controllers/casosController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Caso:
 *       type: object
 *       required:
 *         - titulo
 *         - descricao
 *         - status
 *         - agente_id
 *       properties:
 *         id:
 *           type: string
 *           description: O ID gerado automaticamente para o caso.
 *         titulo:
 *           type: string
 *           description: O título do caso.
 *         descricao:
 *           type: string
 *           description: Uma descrição detalhada do caso.
 *         status:
 *           type: string
 *           description: O status do caso.
 *           enum: [aberto, solucionado]
 *         agente_id:
 *           type: string
 *           description: O ID do agente responsável pelo caso.
 *       example:
 *         id: "f5fb2ad5-22a8-4cb4-90f2-8733517a0d46"
 *         titulo: "homicidio na avenida principal"
 *         descricao: "Disparos foram reportados às 22:33..."
 *         status: "aberto"
 *         agente_id: "401bccf5-cf9e-489d-8412-446cd169a0f1"
 */

/**
 * @swagger
 * tags:
 *   - name: Casos
 *     description: API para gerenciamento de casos policiais
 */

/**
 * @swagger
 * /casos:
 *   get:
 *     summary: Retorna a lista de todos os casos
 *     tags: [Casos]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [aberto, solucionado]
 *         description: Filtra casos pelo status.
 *       - in: query
 *         name: agente_id
 *         schema:
 *           type: string
 *         description: Filtra casos pelo ID do agente responsável.
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Pesquisa por uma palavra-chave no título e descrição do caso.
 *     responses:
 *       200:
 *         description: A lista de casos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Caso'
 */
router.get('/', casosController.getAllCasos);

/**
 * @swagger
 * /casos/{caso_id}/agente:
 *   get:
 *     summary: Retorna os dados do agente responsável por um caso específico
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: caso_id
 *         schema:
 *           type: string
 *         required: true
 *         description: O ID do caso.
 *     responses:
 *       200:
 *         description: Os dados do agente responsável.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agente'
 *       404:
 *         description: Caso ou agente não encontrado.
 */
router.get('/:caso_id/agente', casosController.getAgenteByCasoId);

/**
 * @swagger
 * /casos/{id}:
 *   get:
 *     summary: Retorna um caso específico pelo ID
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: O ID do caso.
 *     responses:
 *       200:
 *         description: Os dados do caso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caso'
 *       404:
 *         description: Caso não encontrado.
 */
router.get('/:id', casosController.getCasoById);

/**
 * @swagger
 * /casos:
 *   post:
 *     summary: Cria um novo caso
 *     tags: [Casos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [aberto, solucionado]
 *               agente_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: O caso foi criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caso'
 *       400:
 *         description: Dados inválidos.
 */
router.post('/', casosController.createCaso);

/**
 * @swagger
 * /casos/{id}:
 *   put:
 *     summary: Atualiza um caso existente por completo
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: O ID do caso.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Caso'
 *     responses:
 *       200:
 *         description: O caso foi atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caso'
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Caso não encontrado.
 */
router.put('/:id', casosController.updateCasoCompleto);

/**
 * @swagger
 * /casos/{id}:
 *   patch:
 *     summary: Atualiza um caso existente parcialmente
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: O ID do caso.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [aberto, solucionado]
 *               agente_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: O caso foi atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caso'
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Caso não encontrado.
 */
router.patch('/:id', casosController.updateCasoParcial);

/**
 * @swagger
 * /casos/{id}:
 *   delete:
 *     summary: Remove um caso
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: O ID do caso.
 *     responses:
 *       204:
 *         description: Caso removido com sucesso.
 *       404:
 *         description: Caso não encontrado.
 */
router.delete('/:id', casosController.deleteCaso);

module.exports = router;
