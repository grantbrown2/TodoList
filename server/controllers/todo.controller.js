const TodoList = require('../models/todo.model');

module.exports.newList = (req, res) => {
    TodoList.create(req.body)
        .then(list => res.json(list))
        .catch(err => res.json(err));
}
module.exports.showLists = (req, res) => {
    TodoList.find({})
        .then(lists => {
            res.json(lists);
        })
        .catch(err => {res.json(err)})
}
module.exports.deleteALL = (req, res) => {
    TodoList.deleteMany({})
        .then(results => {res.json(results);
        })
        .catch(err => {res.json(err)})
}
module.exports.deleteList = (req, res) => {
    TodoList.deleteOne({_id:req.params.id})
        .then(deleteConfirmation => res.json(deleteConfirmation))
        .catch(err => res.json(err))
}

module.exports.addItemToList = (req, res) => {
    const {id} = req.params;
    const {itemName, category} = req.body;
    
    TodoList.findById(id)
    .then(list => {
        const newItem = {
            itemName,
            category,
            isFinished: false
        };
        list.items.push(newItem);
        return list.save();
    })
    .then(updatedList => {
        res.json(updatedList);
    })
    .catch(err => res.status(500).json(err));
}
module.exports.showItem = (req, res) => {
    TodoList.findOne({'items._id' : req.params.itemId})
    .then((list) => {
        const item = list.items.find((item) => item._id.toString() === req.params.itemId);
        res.json(item);
    })
    .catch(err => res.status(500).json(err));
};
module.exports.updateItem = (req, res) => {
    const {id, itemId} = req.params;
    TodoList.findOneAndUpdate(
        {_id : id, 'items._id' : itemId}, // Find the list with the given ID and the matching item ID
        { $set: { 'items.$.itemName' : req.body.itemName, 'item.$.category' : req.body.category} }, // Update the itemName and category fields of the matched item
        {new:true, runValidators: true})
        .then(updatedList => res.json(updatedList))
        .catch(err => res.json(err))
}