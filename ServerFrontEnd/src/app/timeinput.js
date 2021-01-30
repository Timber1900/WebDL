const getTimeInputSpan = () => {
  const outerSpan = document.createElement('span')
  outerSpan.classList.add('test3')

  const input1 = document.createElement('input');
  const input2 = document.createElement('input');
  const input3 = document.createElement('input');
  
  input1.setAttribute('type', 'number')
  input2.setAttribute('type', 'number')
  input3.setAttribute('type', 'number')

  input1.setAttribute('placeholder', '00')
  input2.setAttribute('placeholder', '00')
  input3.setAttribute('placeholder', '00')

  input1.classList.add('test1')
  input2.classList.add('test1')
  input3.classList.add('test1')

  const separatorLabel1 = document.createElement('label')
  separatorLabel1.innerHTML = ":"
  separatorLabel1.classList.add('test2')

  const separatorLabel2 = document.createElement('label')
  separatorLabel2.innerHTML = ":"
  separatorLabel2.classList.add('test2')

  const testFuncTwo = function() {
    const value = input1.value.toString() + input2.value.toString() + input3.value.toString()
    const vals = []
    for(let i = value.length - 1; i >= 0; i -= 2){
      vals.push((value[i - 1] ? value[i - 1] : '') + value[i])
    }
    const inputs = [input1, input2, input3]
    let i = 2
    for(const input of inputs){
      input.value = ''
    }
    console.log(vals)
    for(const value of vals){
      if(i >= 0){
        inputs[i].value = value;
      }
      i--
    }
  }

  const enterCheck = function(event) {
    if(event.key === 'Enter') {
      input1.value = input1.value > 23 ? 23 : input1.value
      input2.value = input2.value > 59 ? 59 : input2.value
      input3.value = input3.value > 59 ? 59 : input3.value
    }
  }

  const focusOut = function() {
    input1.value = input1.value > 23 ? 23 : input1.value
    input2.value = input2.value > 59 ? 59 : input2.value
    input3.value = input3.value > 59 ? 59 : input3.value
  }

  input3.addEventListener('keydown', enterCheck)
  input2.addEventListener('keydown', enterCheck)
  input1.addEventListener('keydown', enterCheck)
  
  input3.addEventListener('focusout', focusOut)
  input2.addEventListener('focusout', focusOut)
  input1.addEventListener('focusout', focusOut)
  
  input3.oninput = testFuncTwo
  input2.oninput = testFuncTwo
  input1.oninput = testFuncTwo

  outerSpan.appendChild(input1)
  outerSpan.appendChild(separatorLabel1)
  outerSpan.appendChild(input2)
  outerSpan.appendChild(separatorLabel2)
  outerSpan.appendChild(input3)
   
  return outerSpan
}

const getTimeInputDiv = () => {
  const div = document.createElement('div')
  div.classList.add('inner')
  const leftInput = getTimeInputSpan()
  const rightInput = getTimeInputSpan()
  const to = document.createElement('label')
  to.innerHTML = "To"

  div.appendChild(leftInput)
  div.appendChild(to)
  div.appendChild(rightInput)

  return div
}