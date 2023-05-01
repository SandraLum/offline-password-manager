import { useState } from 'react'
import DropDownPicker, { DropDownPickerProps, ValueType } from 'react-native-dropdown-picker'

type DropDownListProps = Omit<DropDownPickerProps<ValueType>, 'open' | 'setOpen'>

export default function DropDownList({ ...props }: DropDownListProps) {
	const [open, setOpen] = useState(false)
	const [items, setItems] = useState(props.items)

	return (
		<DropDownPicker {...props} listMode="SCROLLVIEW" open={open} setOpen={setOpen} items={items} setItems={setItems} />
	)
}
