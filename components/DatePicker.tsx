import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';


type DatePickerProps = {
    date: Date;
    mode: 'date' | 'time';
    onChange: (event: DateTimePickerEvent, selectedDate: Date | undefined) => void;
}


export default function DatePicker({ date, mode, onChange }: DatePickerProps) {
  return (
    <DateTimePicker
    value={date}
    mode={mode}
    is24Hour={true}
    onChange={onChange}
    
    />

  )
}