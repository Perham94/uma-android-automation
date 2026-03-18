import { useMemo, useContext, useRef } from "react"
import { View, Text, ScrollView, StyleSheet } from "react-native"
import { useTheme } from "../../context/ThemeContext"
import { BotStateContext } from "../../context/BotStateContext"
import { SearchPageProvider } from "../../context/SearchPageContext"
import CustomSlider from "../../components/CustomSlider"
import CustomTitle from "../../components/CustomTitle"
import PageHeader from "../../components/PageHeader"
import { usePerformanceLogging } from "../../hooks/usePerformanceLogging"

/**
 * The Scenario Overrides Settings page.
 * Provides configuration for scenario-specific behavior overrides.
 */
const ScenarioOverridesSettings = () => {
    usePerformanceLogging("ScenarioOverridesSettings")
    const { colors } = useTheme()
    const bsc = useContext(BotStateContext)
    const scrollViewRef = useRef<ScrollView>(null)

    const { settings, setSettings } = bsc
    const { scenarioOverrides } = settings

    /**
     * Update a scenario override setting.
     * @param key The key of the setting to update.
     * @param value The value to set the setting to.
     */
    const updateOverrideSetting = (key: keyof typeof scenarioOverrides, value: any) => {
        setSettings({
            ...bsc.settings,
            scenarioOverrides: {
                ...bsc.settings.scenarioOverrides,
                [key]: value,
            },
        })
    }

    const styles = useMemo(
        () =>
            StyleSheet.create({
                root: {
                    flex: 1,
                    flexDirection: "column",
                    justifyContent: "center",
                    margin: 10,
                    backgroundColor: colors.background,
                },
                section: {
                    marginBottom: 24,
                },
            }),
        [colors]
    )

    return (
        <View style={styles.root}>
            <PageHeader title="Scenario Overrides Settings" />

            <SearchPageProvider page="ScenarioOverridesSettings" scrollViewRef={scrollViewRef}>
                <ScrollView ref={scrollViewRef} nestedScrollEnabled={true} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                    <View className="m-1">
                        <CustomTitle title="Trackblazer Overrides" description="Specific overrides for the Trackblazer scenario." />

                        <View style={styles.section}>
                            <CustomSlider
                                searchId="trackblazer-consecutive-races-limit"
                                value={scenarioOverrides.trackblazerConsecutiveRacesLimit}
                                placeholder={bsc.defaultSettings.scenarioOverrides.trackblazerConsecutiveRacesLimit}
                                onValueChange={(value) => updateOverrideSetting("trackblazerConsecutiveRacesLimit", value)}
                                onSlidingComplete={(value) => updateOverrideSetting("trackblazerConsecutiveRacesLimit", value)}
                                min={3}
                                max={30}
                                step={1}
                                label="Consecutive Races Limit"
                                labelUnit=""
                                showValue={true}
                                showLabels={true}
                                description="Sets the maximum number of consecutive races the bot is allowed to run in the Trackblazer scenario before stopping. Note that a -30 stat penalty can apply starting from 3 consecutive races."
                            />
                        </View>
                    </View>
                </ScrollView>
            </SearchPageProvider>
        </View>
    )
}

export default ScenarioOverridesSettings
