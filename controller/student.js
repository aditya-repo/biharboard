const insertStudent = async (req,res)=>{
    const data = req.body
    res.json(data)
}

export { insertStudent }