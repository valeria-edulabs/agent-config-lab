// This file is intentionally badly formatted. Don't fix it by hand!
function formatDate (date){
    const d=new Date(date)
  const day=String(d.getDate()).padStart(2,"0");const month=String(d.getMonth()+1).padStart(2,"0")
      return `${day}/${month}/${d.getFullYear()}`
}


module.exports={formatDate}
