const sampleClientForm = { // Sample form currently
  isPublic: false,
  title: "Test Form",
  sectionsOrder: [1, 2], //ordered list of section Ids (any Ids are not unique to any other forms)
  sections: {
    1:"Section A", 
    2:"Section B"
  },
  componentsOrder: {
    1: [1, 2], // sectionId:  list of component Ids in order
    2: [1] 
  },
  components: {
    1:"Component A", //componentId: componentTitle
    2:"Component B"
  },
  itemsOrder: { 
    1: [1, 2], //componentId: ordered list of itemIds
    2: [3],
  },
  items: { //itemId: itemData
    1:{
      type: "textlabel",
      label: "Item 1",
      required: true,
      defaultVisibility: true
    },
    2:{
      type: "textlabel",
      label: "Item 2",
      required: true,
      defaultVisibility: true
    },
    3:{
      type: "textlabel",
      label: "Item 3",
      required: true,
      defaultVisibility: true
    }
  },
  checklistItems: [{sectionId: 1, description: "Verify Email"}, {sectionId: 2, description: "Check Society"}]
  }
  
const sampleServerForm = {
  title: "Test Form",
  isPublic: false,
  sections: [
    {
      sectionId: 1,
      title: "Section A",
      componentsOrder: [1, 2]
    },
    {
      sectionId: 2,
      title: "Section B",
      componentsOrder: []
    }
  ],
  components: [
    {
      componentId: 1,
      title: "Component A",
      itemsOrder: [1, 2]
    },
    {
      componentId: 2,
      title: "Component B",
      itemsOrder: [3]
    }
  ],
  items: [
    {
      itemId: 1,
      type: "textlabel",
      label: "Item 1",
      required: true,
      defaultVisibility: true
    },
    {
      itemId: 2,
      type: "textlabel",
      label: "Item 2",
      required: true,
      defaultVisibility: true
    },
    {
      itemId: 3,
      type: "textlabel",
      label: "Item 3",
      required: true,
      defaultVisibility: true
    }
  ],
  checklistItems: [{sectionId: 1, description: "Verify Email"}, {sectionId: 2, description: "Check Society"}]
}
    
export function convertToServerForm(clientForm) {
  // for use in Create/Edit Form before sending the template
  // creating the uniquely defined objects that the server form template requires
  let sections = [], components = [], items = []
  // const {id, title, creatorName, isPublic, sections, components, items,
  //   sectionsOrder, componentsOrder, itemsOrder } = clientForm
  
  clientForm.sectionsOrder.forEach(sectionId=>{
    sections.push({ // sections creation
      sectionId,
      title: clientForm.sections[sectionId],
      componentsOrder: clientForm.componentsOrder[sectionId]
    })

    clientForm.componentsOrder[sectionId].forEach(componentId=> {
      components.push({ // components creation
        componentId,
        title: clientForm.components[componentId],
        itemsOrder: clientForm.itemsOrder[componentId]
      })

      clientForm.itemsOrder[componentId].forEach(itemId => {        
        let item = {...clientForm.items[itemId]}
        if ('options' in item){
          item['options'] = item.options.map((option,index) => ({'optionId': index,  'data': option}))
        }
        if (!('required' in item)){
          item = {...item, required: true}
        }
        items.push({ // items creation
          itemId,
          ...item,
        })
      })
    })
  })
  
  return{
    title: clientForm.title,
    isPublic: clientForm.isPublic,
    checklistItems: clientForm.checklistItems,
    sections,
    components,
    items
  }
  
}

export function convertToClientForm(serverForm) {
  // for use in Fetch Form to convert the form before pushing it to state
  // creating the uniquely defined objects that the client form template requires
  let sectionsOrder = [], componentsOrder = {}, itemsOrder = {}, sections = {}, components = {}, items = {}
  
  // const {title, isPublic, sections, components, items } = serverForm
  
  // sections, sectionsOrder, componentsOrder creation
  serverForm.sections.forEach(section=>{
    const sectionId = section.sectionId
    sectionsOrder.push(sectionId)
    componentsOrder[sectionId] = section.componentsOrder
    sections[sectionId] = section.title
  })
  
  // components creation
  serverForm.components.forEach(component=>{
    itemsOrder[component.componentId] = component.itemsOrder
    components[component.componentId] = component.title
  })
  
  // items, itemsOrder creation
  serverForm.items.forEach(item=>{
    let itemCopy = {...item}
    if ('options' in itemCopy){
      itemCopy['options'] = itemCopy['options'].map(option => option.data)
    }
    if (!('required' in itemCopy)){
      itemCopy = {...itemCopy, required: true}
    }
    items[item.itemId] = {...itemCopy}
    delete items[item.itemId]["itemId"]
  })
  
  const checklistItems = serverForm.checklist.map(checklistItem => 
    ({sectionId: checklistItem.sectionId, description: checklistItem.description}))
  // everything else will be directly copied
  return {
    isPublic: serverForm.isPublic,
    title: serverForm.title,
    sectionsOrder,
    checklistItems: checklistItems,
    componentsOrder,
    itemsOrder,
    sections,
    components,
    items
  } //converted form
}