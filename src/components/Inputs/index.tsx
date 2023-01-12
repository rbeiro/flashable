import {
  ExclamationTriangleIcon,
  EyeNoneIcon,
  EyeOpenIcon,
} from '@radix-ui/react-icons'
import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  RefObject,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import s from './styles.module.scss'

interface InputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  labelName: string
  reference?: any
  errorMessage?: string
  whiteSpace?: boolean
  labelBackgroundColor?: string
}

export function Input({
  whiteSpace = false,
  labelName,
  reference,
  errorMessage,
  labelBackgroundColor,
  ...props
}: InputProps) {
  return (
    <div className={s.errorMessageInputWrapper}>
      <div className={s.inputContainer}>
        <input placeholder={labelName} ref={reference} {...props} />
        <label style={{ backgroundColor: labelBackgroundColor }}>
          {labelName}
        </label>
      </div>
      {errorMessage && (
        <span className={s.errorMessage}>
          <ExclamationTriangleIcon />
          {errorMessage}
        </span>
      )}
      {whiteSpace && <span className={s.observationMessage}>.</span>}
    </div>
  )
}

interface MultlineInputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  initialHeight?: string
}

export function MultiLineInput({
  initialHeight = 'auto',
  ...props
}: MultlineInputProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const setHeightToCurrentScrollHeight = function (
    ref: RefObject<HTMLTextAreaElement>,
  ) {
    if (ref && ref.current) {
      ref.current.style.height = initialHeight
      ref.current.style.height = `${ref.current.scrollHeight}px`
    }
  }

  useEffect(() => {
    setHeightToCurrentScrollHeight(inputRef)
  })

  return (
    <textarea
      ref={inputRef}
      style={{ height: initialHeight }}
      className={s.multilineInputTextarea}
      {...props}
      onFocus={() => setHeightToCurrentScrollHeight(inputRef)}
      onBlur={() => setHeightToCurrentScrollHeight(inputRef)}
    />
  )
}

export function PasswordInput({
  labelName,
  reference,
  errorMessage,
  ...props
}: InputProps) {
  const [passwordInputCurrentType, setPasswordInputCurrentType] =
    useState('password')

  function handleinputTypeToogle() {
    if (passwordInputCurrentType === 'password') {
      setPasswordInputCurrentType('text')
      return
    }

    setPasswordInputCurrentType('password')
  }

  return (
    <div className={s.errorMessageInputWrapper}>
      <div className={s.inputContainer}>
        <input
          placeholder={labelName}
          ref={reference}
          type={passwordInputCurrentType}
          {...props}
        />
        <label>{labelName}</label>
        {passwordInputCurrentType === 'password' ? (
          <button
            className={s.changeInputTypeButton}
            onClick={handleinputTypeToogle}
            type="button"
          >
            <EyeNoneIcon />
          </button>
        ) : (
          <button
            className={s.changeInputTypeButton}
            onClick={handleinputTypeToogle}
            type="button"
          >
            <EyeOpenIcon />
          </button>
        )}
      </div>
      {errorMessage && (
        <span className={s.errorMessage}>
          <ExclamationTriangleIcon />
          {errorMessage}
        </span>
      )}
    </div>
  )
}

interface MaskedPlaceholderInputProps extends InputProps {
  maskplaceholder: string
}

interface KeyboardEvent<T = Element> extends SyntheticEvent<T, KeyboardEvent> {
  altKey: boolean
  /** @deprecated */
  charCode: number
  ctrlKey: boolean
  getModifierState(key: string): boolean
  key: string
  /** @deprecated */
  keyCode: number
  locale: string
  location: number
  metaKey: boolean
  repeat: boolean
  shiftKey: boolean
  /** @deprecated */
  which: number
}

export function MaskedPlaceholderInput({
  labelName,
  reference,
  errorMessage,
  maskplaceholder,
  ...props
}: MaskedPlaceholderInputProps) {
  const [initialmaskplaceholder, setinitialmaskplaceholder] = useState('')

  // remove the underscores and delete any duplicates
  const separators = maskplaceholder
    .replaceAll('_', '')
    .split('')
    .filter(function (item, pos, self) {
      return self.indexOf(item) === pos
    })
    .join('')

  // replace the string with a new value
  function replaceMaskInput(
    target: string,
    start: number,
    value: string,
    end: number,
    base?: number,
  ): string {
    const baseStart = base || 0
    return target.substring(baseStart, start) + value + target.substring(end)
  }

  // repeat a character x amount of times and return as one string
  function repeatString(amount: number, character: string) {
    const string = []
    for (let i = 0; i < amount; i++) {
      string.push(character)
    }
    return string.join('')
  }

  function addAutoDateFormat(e: SyntheticEvent<HTMLInputElement, Event>) {
    if (initialmaskplaceholder === '') {
      setinitialmaskplaceholder(maskplaceholder)
    }
  }

  function handleUserKeyPress(e: any) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      return
    }
    if (e.code === 'Space') {
      e.preventDefault()
      return
    }
    e.preventDefault()
    const target = e.target as HTMLInputElement
    const initialStart = target.selectionStart
    const initialEnd = target.selectionEnd
    const backspacedElement = target.value[target.selectionStart! - 1]

    const selectedElements =
      initialStart === 0
        ? target.value.slice(initialStart!, initialEnd! + 1)
        : target.value.slice(initialStart! - 1, initialEnd!)

    const selectedElementsMask =
      initialStart === 0
        ? maskplaceholder.slice(initialStart!, initialEnd! + 1)
        : maskplaceholder.slice(initialStart!, initialEnd!)

    if (e.key === 'Backspace') {
      const controlKeyWasPressed = e.nativeEvent.ctrlKey

      e.preventDefault()
      if (initialStart !== null && initialEnd !== null) {
        if (maskplaceholder.includes(selectedElements)) {
          if (separators.includes(selectedElements)) {
            if (target.value[initialStart - 2] !== '_') {
              const replacedString =
                target.value.substring(0, initialStart - 2) +
                '_' +
                target.value.substring(initialStart - 1, maskplaceholder.length)
              target.value = replacedString
            }
            target.setSelectionRange(initialStart - 2, initialEnd - 2)
            return
          }
          if (selectedElements.length > 1) {
            const replacedString =
              target.value.substring(0, initialStart) + selectedElementsMask
            target.value = replacedString
            target.setSelectionRange(initialStart, initialStart)
            return
          }
          if (initialStart === 0) {
            return
          }
          target.setSelectionRange(initialStart - 1, initialEnd - 1)
          return
        }

        if (selectedElements.length > 1) {
          const replacedString =
            target.value.substring(0, initialStart) + selectedElementsMask
          target.value = replacedString
          target.setSelectionRange(initialStart, initialStart)
          return
        }

        if (controlKeyWasPressed) {
          const indexOfSeparators: number[] = []
          const cursorPositions: { after?: number; before?: number } = {}
          const maskArray = maskplaceholder.split('')

          maskArray.forEach((cur, index) => {
            if (separators.includes(cur)) {
              indexOfSeparators.push(index)
            }
          })
          indexOfSeparators.forEach((cur, index) => {
            if (initialStart - 1 > cur) {
              cursorPositions.after = (cursorPositions.after || 0) + 1
              return
            }

            if (initialStart - 1 < cur) {
              cursorPositions.before = (cursorPositions.before || 0) + 1
            }
          })
          const section = indexOfSeparators.length - cursorPositions.before!
          const beginningOfString = target.value.substring(
            0,
            indexOfSeparators[section - 1] + 1,
          )
          const middleOfString = target.value.substring(
            indexOfSeparators[section - 1] + 1,
            initialStart,
          )
          const endOfString = target.value.substring(initialStart)

          if (cursorPositions.before === indexOfSeparators.length) {
            target.value =
              repeatString(middleOfString.length, '_') + endOfString
            target.setSelectionRange(
              indexOfSeparators[section - 1] + 1,
              indexOfSeparators[section - 1] + 1,
            )
            return
          }

          if (cursorPositions.after === indexOfSeparators.length) {
            const beforeLastSection = target.value.substring(
              0,
              indexOfSeparators[indexOfSeparators.length - 1] + 1,
            )
            const beforeCursor = target.value.substring(
              indexOfSeparators[indexOfSeparators.length - 1] + 1,
              initialStart,
            )

            target.value =
              beforeLastSection +
              repeatString(beforeCursor.length, '_') +
              endOfString
            target.setSelectionRange(
              indexOfSeparators[indexOfSeparators.length - 1],
              indexOfSeparators[indexOfSeparators.length - 1],
            )
            return
          }

          target.value =
            beginningOfString +
            repeatString(middleOfString.length, '_') +
            endOfString
          target.setSelectionRange(
            indexOfSeparators[section - 1],
            indexOfSeparators[section - 1],
          )
          return
        }

        const replacedString = replaceMaskInput(
          target.value,
          initialStart - 1,
          '_',
          initialEnd,
        )
        target.value = replacedString
        target.setSelectionRange(initialStart - 1, initialEnd - 1)
        return
      }

      if (initialStart === maskplaceholder.length || initialStart === 0) {
        return
      }

      if (initialStart === 0) {
        e.preventDefault()
        target.setSelectionRange(initialStart, initialStart)
        return
      }

      if (initialStart === 1 && initialEnd && backspacedElement !== '/') {
        e.preventDefault()
        const replacedString = replaceMaskInput(
          target.value,
          initialStart + 1,
          '_',
          initialStart + 1,
          1,
        )
        target.value = replacedString
        target.setSelectionRange(initialStart, initialEnd)
        return
      }

      return
    }

    if (isFinite(e.key)) {
      e.preventDefault()
      if (initialStart && initialEnd) {
        if (initialStart >= maskplaceholder.length) {
          return
        }

        if (!separators.includes(target.value[initialStart])) {
          const replacedString = replaceMaskInput(
            target.value,
            initialStart,
            e.key,
            initialStart + 1,
          )
          target.value = replacedString
          target.setSelectionRange(initialStart + 1, initialEnd + 1)
          return
        }

        if (separators.includes(target.value[initialStart])) {
          const replacedString =
            target.value.substring(0, initialStart + 1) +
            e.key +
            target.value.substring(initialStart + 2, maskplaceholder.length)
          target.value = replacedString
          target.setSelectionRange(initialStart + 2, initialEnd + 2)
          return
        }
      }

      if (
        initialStart === 0 &&
        !separators.includes(target.value[initialStart])
      ) {
        e.preventDefault()
        const replacedString =
          target.value.substring(0, initialStart) +
          e.key +
          target.value.substring(initialStart + 1)
        target.value = replacedString
        target.setSelectionRange(initialStart + 1, initialStart + 1)
      }
    }
  }

  return (
    <div className={s.container}>
      <div className={s.inputContainer}>
        <input
          placeholder={labelName}
          ref={reference}
          type="text"
          onKeyDown={handleUserKeyPress}
          onFocus={addAutoDateFormat}
          defaultValue={maskplaceholder}
          {...props}
        />
        <label>{labelName}</label>
      </div>
      {errorMessage && (
        <span className={s.errorMessage}>
          <ExclamationTriangleIcon />
          {errorMessage}
        </span>
      )}
    </div>
  )
}
