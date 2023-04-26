
CheckMod(mod) {
	for i, element in ListOfMods
	{
    	; Check if the search string is present in the current element
    	if (InStr(element, ItemModArray[i]))
    	{
        return true
    	} else {
        return false
      }
  }
}