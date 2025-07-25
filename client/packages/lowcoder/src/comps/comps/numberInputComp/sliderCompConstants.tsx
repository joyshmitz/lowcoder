import { BoolCodeControl, NumberControl } from "../../controls/codeControl";
import { LabelControl } from "../../controls/labelControl";
import { withDefault } from "../../generators";
import { ChangeEventHandlerControl } from "../../controls/eventHandlerControl";
import { Section, lightenColor, sectionNames } from "lowcoder-design";
import { RecordConstructorToComp } from "lowcoder-core";
import { styleControl } from "comps/controls/styleControl";
import {  AnimationStyle, InputFieldStyle, LabelStyle, SliderStyle, SliderStyleType, DisabledSliderStyle, DisabledSliderStyleType, heightCalculator, widthCalculator  } from "comps/controls/styleControlConstants";
import styled, { css } from "styled-components";
import { default as Slider } from "antd/es/slider";
import { darkenColor, fadeColor } from "lowcoder-design";
import { disabledPropertyView, hiddenPropertyView, showDataLoadingIndicatorsPropertyView } from "comps/utils/propertyUtils";
import { IconControl } from "comps/controls/iconControl";
import { trans } from "i18n";
import { memo, useCallback, useContext } from "react";
import { EditorContext } from "comps/editorState";

const getStyle = (style: SliderStyleType, vertical: boolean, disabledStyle?: DisabledSliderStyleType) => {
  return css`
    &.ant-slider:not(.ant-slider-disabled) {
      &,
      &:hover,
      &:focus {
        .ant-slider-rail {
          background-color: ${style.track};
        }
        .ant-slider-track {
          background-color: ${style.fill};
        }
        .ant-slider-handle {
          background-color: ${style.thumb};
          border-color: ${style.thumbBorder};
        }
      }
      &:hover {
        .ant-slider-rail {
          background-color: ${darkenColor(style.track, 0.1)};
        }
      }
      .ant-slider-handle:focus {
        box-shadow: 0 0 0 5px ${fadeColor(darkenColor(style.thumbBorder, 0.08), 0.12)};
      }
      .ant-slider-handle::after {
        box-shadow: 0 0 0 2px ${lightenColor(style.thumbBorder, 0.1)};
      }
      .ant-slider-handle:hover,
      .ant-slider-handle:active,
      .ant-slider-handle:focus {
        &::after {
          box-shadow: 0 0 0 5px ${style.thumbBorder};
        }
      }
      ${vertical && css`
        width: auto;	
        min-height: calc(300px - ${style.margin});
        margin: ${style.margin} auto !important;
      `}
    }
    
    /* Disabled state styling */
    &.ant-slider-disabled {
      .ant-slider-rail {
        background-color: ${disabledStyle?.disabledTrack || lightenColor(style.track, 0.2)} !important;
      }
      .ant-slider-track {
        background-color: ${disabledStyle?.disabledFill || lightenColor(style.fill, 0.3)} !important;
      }
      ${vertical && css`
        width: auto;	
        min-height: calc(300px - ${style.margin});
        margin: ${style.margin} auto !important;
      `}
    }
  `;
};

export const SliderStyled = styled(Slider)<{ 
  $style: SliderStyleType, 
  $vertical: boolean,
  $disabledStyle?: DisabledSliderStyleType 
}>`
  ${(props) => props.$style && getStyle(props.$style, props.$vertical, props.$disabledStyle)}
`;

export const SliderWrapper = styled.div<{ $vertical: boolean }>`
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  .ant-slider {
    width: 100%;
  }
`

export const SliderChildren = {
  max: withDefault(NumberControl, "100"),
  min: withDefault(NumberControl, "0"),
  step: withDefault(NumberControl, "1"),
  label: LabelControl,
  disabled: BoolCodeControl,
  onEvent: ChangeEventHandlerControl,
  style: styleControl(InputFieldStyle, 'style'), 
  labelStyle: styleControl(
    LabelStyle.filter((style)=> ['accent','validate'].includes(style.name) === false),
    'labelStyle',
  ),
  prefixIcon: IconControl,
  suffixIcon: IconControl,
  inputFieldStyle: styleControl(SliderStyle, 'inputFieldStyle'),
  disabledSliderStyle: styleControl(DisabledSliderStyle, 'disabledSliderStyle'),
  animationStyle: styleControl(AnimationStyle, 'animationStyle')
};

const InteractionSection = memo(({ children }: { children: RecordConstructorToComp<typeof SliderChildren & { hidden: typeof BoolCodeControl }> }) => {
  const editorModeStatus = useContext(EditorContext).editorModeStatus;
  
  if (!["logic", "both"].includes(editorModeStatus)) {
    return null;
  }

  return (
    <Section name={sectionNames.interaction}>
      {children.onEvent.getPropertyView()}
      {disabledPropertyView(children)}
      {hiddenPropertyView(children)}
      {showDataLoadingIndicatorsPropertyView(children as any)}
      {(children as any).tabIndex?.propertyView({ label: trans("prop.tabIndex") })}
    </Section>
  );
});

const LayoutSection = memo(({ children }: { children: RecordConstructorToComp<typeof SliderChildren & { hidden: typeof BoolCodeControl }> }) => {
  const editorModeStatus = useContext(EditorContext).editorModeStatus;
  
  if (!["layout", "both"].includes(editorModeStatus)) {
    return null;
  }

  return (
    <>
      {children.label.getPropertyView()}
      <Section name={sectionNames.layout}>
        {children.prefixIcon.propertyView({ label: trans("button.prefixIcon") })}
        {children.suffixIcon.propertyView({ label: trans("button.suffixIcon") })}
      </Section>
      <Section name={sectionNames.style}>
        {children.style.getPropertyView()}
      </Section>
      <Section name={sectionNames.labelStyle}>
        {children.labelStyle.getPropertyView()}
      </Section>
      <Section name={sectionNames.inputFieldStyle}>
        {children.inputFieldStyle.getPropertyView()}
      </Section>
      <Section name={trans("prop.disabledStyle")}>
        {children.disabledSliderStyle.getPropertyView()}
      </Section>
      <Section name={sectionNames.animationStyle} hasTooltip={true}>
        {children.animationStyle.getPropertyView()}
      </Section>
    </>
  );
});

export const SliderPropertyView = memo((
  children: RecordConstructorToComp<typeof SliderChildren & { hidden: typeof BoolCodeControl }>
) => (
  <>
    <InteractionSection children={children} />
    <LayoutSection children={children} />
  </>
));

SliderPropertyView.displayName = 'SliderPropertyView';
