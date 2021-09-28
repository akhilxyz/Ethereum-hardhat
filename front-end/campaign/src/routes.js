const router = require('express').Router()
const CampaignHandler = require('./handler')

// After going Campaign route we have some Request Methods for different operations

// POST - Create - 201 (Created), link to /Campaignscontaining new ID. Avoid using POST on single resource
router.post('/', CampaignHandler.addCampaign)

// GET - Read - 200 (OK), list of Campaigns. Use pagination, sorting and filtering to navigate big lists. 200 (OK), single Campaign. 404 (Not Found), if ID not found or invalid.
router.get('/' , CampaignHandler.getCampaign)

router.post('/exists' , CampaignHandler.checkCampaign)


//PATCH - Partial Update/Modify - 405 (Method not allowed), unless you want to modify the collection itself. 200 (OK) or 204 (No Content). Use 404 (Not Found), if ID not found or invalid.
router.patch('/' , CampaignHandler.updateCampaign)

// DELETE - Delete 405 (Method not allowed), unless you want to delete the whole collection — use with caution. 200 (OK). 404 (Not Found), if ID not found or invalid.
// router.delete('/' , CampaignHandler.deleteCampaign)

module.exports = router;