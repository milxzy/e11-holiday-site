Here’s the Gemini Image Generation documentation converted into a **Markdown knowledge base entry**, structured for LLM ingestion and reference:

---

# Gemini API — Image Generation (Nano Banana / Gemini 2.5 Flash Image)

## Overview

Gemini 2.5 Flash Image (aka *Nano Banana*) supports text-to-image generation, image editing, multi-image composition, and conversational refinement.
All generated outputs include a **SynthID watermark**.

---

## Capabilities

* **Text-to-Image**: Generate high-quality images from descriptive text prompts.
* **Text + Image Editing**: Modify or enhance images with text prompts.
* **Multi-Image Composition & Style Transfer**: Combine images or transfer artistic styles.
* **Iterative Refinement**: Conversational editing with step-by-step adjustments.
* **High-Fidelity Text Rendering**: Generate accurate and legible text within images.

---

## Example Usage

### Text-to-Image (Python)

```python
from google import genai
from PIL import Image
from io import BytesIO

client = genai.Client()
prompt = "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme"

response = client.models.generate_content(
    model="gemini-2.5-flash-image-preview",
    contents=[prompt],
)

for part in response.candidates[0].content.parts:
    if part.text:
        print(part.text)
    elif part.inline_data:
        image = Image.open(BytesIO(part.inline_data.data))
        image.save("generated_image.png")
```

### Text + Image Editing (Python)

```python
from google import genai
from PIL import Image
from io import BytesIO

client = genai.Client()
prompt = "Create a picture of my cat eating a nano-banana in a fancy restaurant under the Gemini constellation"

image = Image.open("/path/to/cat_image.png")

response = client.models.generate_content(
    model="gemini-2.5-flash-image-preview",
    contents=[prompt, image],
)

for part in response.candidates[0].content.parts:
    if part.text:
        print(part.text)
    elif part.inline_data:
        image = Image.open(BytesIO(part.inline_data.data))
        image.save("generated_image.png")
```

---

## Other Supported Modes

* **Text → Images + Text**: Generate images with descriptive text.
* **Image(s) + Text → Images + Text**: Input text + images for edited or new outputs.
* **Multi-turn Conversational Editing**: Iteratively refine images.

---

## Prompting Strategies

### 1. Photorealistic Scenes

```
A photorealistic [shot type] of [subject], [action/expression], in [environment].
Lit by [lighting description], creating [mood].
Captured with [camera/lens]. Focus on [textures/details]. [Aspect ratio].
```

### 2. Stylized Illustrations & Stickers

```
A [style] sticker of [subject], featuring [key traits] in [color palette].
Use [line style] and [shading style]. Transparent background.
```

### 3. Accurate Text in Images

```
Create a [image type] for [brand/concept] with text "[TEXT]" in [font style].
Design: [style]. Colors: [scheme].
```

### 4. Product Mockups

```
High-res, studio-lit photo of [product] on [background].
Lighting: [setup]. Angle: [type]. Focus on [detail].
```

### 5. Minimalist / Negative Space

```
Minimalist composition. Single [subject] in [frame location].
Background: [color]. Lighting: soft/subtle. [Aspect ratio].
```

### 6. Sequential Art (Comics/Storyboards)

```
Single comic panel in [art style].
Foreground: [character/action]. Background: [setting].
Includes dialogue/caption: "[TEXT]". Mood: [lighting/mood].
```

---

## Image Editing Examples

### Add / Remove Elements

```
Using provided image of [subject], [add/remove/modify] [element].
Ensure integration matches style, lighting, perspective.
```

### Inpainting (Semantic Masking)

```
Using provided image, change only [element] to [new description].
Preserve all other details.
```

### Style Transfer

```
Transform provided photo of [subject] into style of [artist/art style].
Preserve composition, render with [style traits].
```

### Multi-Image Composition

```
Combine [element1 from image1] with [element2 from image2].
Final scene: [description].
```

### High-Fidelity Detail Preservation

```
Place [element2] onto [element1].
Preserve all features of [element1].
Integrate [element2] naturally into scene.
```

---

## Best Practices

* **Be Hyper-Specific**: Add detailed descriptions.
* **Provide Context & Intent**: Explain image purpose.
* **Iterate & Refine**: Use follow-up edits.
* **Step-by-Step Instructions**: Break down complex prompts.
* **Semantic Negative Prompts**: Phrase positively (“empty street” vs “no cars”).
* **Camera Control**: Use cinematic terms (macro, wide-angle, low-angle).

---

## Limitations

* Supported languages: `EN, es-MX, ja-JP, zh-CN, hi-IN`
* Max input: **3 images**
* No audio/video input
* Text rendering works best when generated separately first
* Restrictions: Cannot upload child images in EEA, CH, UK
* All images include SynthID watermark

---

## Gemini vs Imagen

| Attribute        | Imagen                                                     | Gemini Native Image                               |
| ---------------- | ---------------------------------------------------------- | ------------------------------------------------- |
| **Strengths**    | Highest photorealism, sharper clarity, accurate typography | Flexible, conversational, iterative editing       |
| **Availability** | General availability                                       | Preview (production allowed)                      |
| **Latency**      | Low (real-time optimized)                                  | Higher latency                                    |
| **Cost**         | \$0.02–0.12 / image                                        | Token-based (\~1290 tokens/image)                 |
| **Recommended**  | Photorealism, logos, typography, branding                  | Conversational editing, interleaved text + images |

---

## Next Steps

* Cookbook guide: More examples & recipes
* Veo guide: Video generation with Gemini
* Gemini models reference

---

Do you want me to **also create a JSON version** of this knowledge entry (so it can be machine-ingested in structured form), or is Markdown enough for your use case?
