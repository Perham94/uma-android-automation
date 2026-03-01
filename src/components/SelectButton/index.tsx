/** @format */

import React, { useRef, useState, useMemo } from 'react';
import { View, LayoutChangeEvent, ViewStyle, PressableProps, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text } from '../ui/text';
import { useTheme } from '../../context/ThemeContext';
import {
    Option,
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
    NativeSelectScrollView,
} from '../ui/select';
import CustomButton from '../CustomButton';
import CustomSelect from '../CustomSelect';
import { Ionicons } from "@expo/vector-icons"
import SearchableItem from '../SearchableItem';


interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

interface SelectButtonProps extends PressableProps {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    size?: "default" | "sm" | "lg" | "icon"
    style?: ViewStyle
    className?: string
    disabled?: boolean
    isLoading?: boolean
    fontSize?: number
    icon?: React.ReactElement
    iconPosition?: "left" | "right"
    options?: SelectOption[]
    groupLabel?: string
    portalHost?: string
    defaultValue?: string
    value?: string
    setValue?: React.Dispatch<React.SetStateAction<string>>
    onValueChange?: (value: string | undefined) => void
}

const SelectButton: React.FC<SelectButtonProps> = ({
    variant = "default",
    size = "default",
    style,
    className = "",
    disabled = false,
    isLoading = false,
    fontSize,
    icon,
    iconPosition = "left",
    options = [],
    groupLabel,
    portalHost,
    defaultValue,
    value,
    setValue,
    onValueChange,
    ...props
}) => {
    const { colors, isDark } = useTheme()

    const [isDropdownVisible, setIsDropdownVisible] = useState(false)
    const triggerRef = useRef<View>(null)
    const [triggerWidth, setTriggerWidth] = useState<number>(0)

    const currentLabel = options.find((item) => item.value === (value || defaultValue))?.label

    const styles = useMemo(
        () =>
            StyleSheet.create({
                container: {
                    flexDirection: "row",
                    overflow: "hidden",
                    alignItems: "center",
                    padding: 10,
                },
                button: {
                    flex: 1,
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                },
                buttonDropdown: {
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                },
                dropdownMenu: {
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    zIndex: 1,
                    maxHeight: 150,
                },
                menuItem: {
                    padding: 10,
                },
            }),
        [colors],
    );

    /**
     * Callback fired when the trigger layout changes.
     * The trigger layout is used to determine the width of the dropdown content.
     * @param event The layout change event.
     */
    const onTriggerLayout = (event: LayoutChangeEvent) => {
        const { width: measuredWidth } = event.nativeEvent.layout
        setTriggerWidth(measuredWidth)
    }

    // Determine the background color based on variant and theme.
    const getBackgroundColor = () => {
        if (disabled) return { opacity: 0.5 }

        switch (variant) {
            case "destructive":
                return { backgroundColor: colors.destructive }
            case "outline":
                return { backgroundColor: isDark ? "black" : "white" }
            case "secondary":
                return { backgroundColor: colors.secondary }
            case "ghost":
                return { backgroundColor: "transparent" }
            case "link":
                return { backgroundColor: "transparent" }
            default:
                return {}
        }
    }

    // Determine the text color based on variant and theme.
    const getTextColor = () => {
        switch (variant) {
            case "destructive":
                return "white"
            case "outline":
                return isDark ? "white" : "black"
            case "secondary":
                return isDark ? "black" : "white"
            default:
                return "black"
        }
    }

    // Apply custom styling for specific variants that need theme-aware colors.
    const getCustomStyle = () => {
        if (disabled) return {}

        switch (variant) {
            case "destructive":
                return { backgroundColor: colors.destructive }
            case "outline":
                return { borderColor: isDark ? "white" : "black" }
            case "secondary":
                return { backgroundColor: isDark ? colors.secondary : colors.primary }
            case "default":
                return { backgroundColor: isDark ? colors.primary : colors.secondary }
            default:
                return {}
        }
    }

    const toggleDropdown = () => {
        setIsDropdownVisible(prev => !prev)
    }

    const onPressButton = () => {
        console.log("clicked button")
    }

    const onPressDropdown = () => {
        console.log("clicked dropdown")
        toggleDropdown()
    }

    const handleValueChange = (option: Option) => {
        toggleDropdown()

        if (onValueChange) {
            onValueChange(option?.value || "")
            
        }
        if (setValue) {
            setValue(option?.value || "")
        }
    }

    return (
        <View style={styles.container}>
            <CustomButton
                style={styles.button}
                variant={variant}
                isLoading={isLoading}
                onPress={onPressButton}
            >
                {value}
            </CustomButton>
            <Select
                onValueChange={handleValueChange}
                value={value as any}
                defaultValue={defaultValue as any}
                disabled={disabled}
            >
                <View ref={triggerRef} style={{}} onLayout={onTriggerLayout}>
                    <CustomButton
                        style={styles.buttonDropdown}
                        variant={variant}
                        isLoading={false}
                        onPress={onPressDropdown}
                    >
                        <Ionicons name="caret-down" size={24} color={getTextColor()} />
                    </CustomButton>
                </View>
                <SelectContent style={{ width: triggerWidth }} portalHost={portalHost}>
                    <NativeSelectScrollView>
                        <SelectGroup>
                            {groupLabel && <SelectLabel>{groupLabel}</SelectLabel>}
                            {options &&
                                options.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        label={option.label}
                                        value={option.value}
                                        disabled={option.disabled}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                        </SelectGroup>
                    </NativeSelectScrollView>
                </SelectContent>
            </Select>
        </View>
    )

};

export default React.memo(SelectButton);
